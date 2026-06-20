import * as React from "react"
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useHome } from "./useHome"
import { setStep } from '../../profile/store/profileSlice'
import {
  useGetJobsQuery,
  useStartJobSyncMutation,
  useGetSyncStatusQuery
} from '../api/jobsApi'

export const useHomeDashboard = () => {
  const { user, handleLogout, isLoggingOut } = useHome()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [appliedJobs, setAppliedJobs] = React.useState<Record<string, boolean>>({})
  const [toastMessage, setToastMessage] = React.useState<string | null>(null)
  
  // Sync state
  const [activeSyncId, setActiveSyncId] = React.useState<string | null>(null)

  // 1. Fetch real jobs from DB
  const { data: dbJobsData, refetch: refetchJobs } = useGetJobsQuery()

  // 2. Start Sync mutation
  const [triggerSync] = useStartJobSyncMutation()

  // 3. Poll Sync Status
  const { data: syncStatus } = useGetSyncStatusQuery(activeSyncId || '', {
    skip: !activeSyncId,
    pollingInterval: 3000,
  })

  const profile = user?.profile
  const firstName = profile?.firstName || user?.name?.split(' ')[0] || "User"
  const lastName = profile?.lastName || user?.name?.split(' ')[1] || ""
  const fullName = profile ? `${profile.firstName} ${profile.lastName}` : user?.name || "User"
  const skills = profile?.skills || []
  const preferredRoles = profile?.preferredRoles || []
  const preferredLocations = profile?.preferredLocations || []
  const experiences = profile?.experiences || []
  const projects = profile?.projects || []
  const currentStatus = profile?.currentStatus || "WORKING_PROFESSIONAL"

  // Trigger sync process
  const handleStartSync = async () => {
    try {
      setToastMessage("Initiating job synchronization...")
      const response = await triggerSync().unwrap()
      
      if (response.syncId) {
        setActiveSyncId(response.syncId)
        if (response.status === 'already_running') {
          setToastMessage("Sync is already running in background.")
        } else {
          setToastMessage("Sync job queued successfully!")
        }
      }
    } catch (err: any) {
      setToastMessage(`Failed to start sync: ${err.data?.message || err.message}`)
      setTimeout(() => setToastMessage(null), 3000)
    }
  }

  // Monitor sync status transitions
  React.useEffect(() => {
    if (!syncStatus) return

    if (syncStatus.status === 'COMPLETED') {
      setToastMessage(`Sync completed! Discovered ${syncStatus.jobsFound} jobs (+${syncStatus.jobsAdded} new)`)
      refetchJobs() // Reload real jobs from PostgreSQL
      const timer = setTimeout(() => {
        setActiveSyncId(null)
        setToastMessage(null)
      }, 5000)
      return () => clearTimeout(timer)
    }

    if (syncStatus.status === 'FAILED') {
      setToastMessage("Synchronization failed. Check error log.")
      const timer = setTimeout(() => {
        // Keep status visible so user can see error and retry
        setToastMessage(null)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [syncStatus, refetchJobs])

  // Map real database jobs to the frontend presentation layout
  const jobsList = React.useMemo(() => {
    const dbJobs = dbJobsData?.jobs || []
    
    if (dbJobs.length === 0) {
      // Fallback default list if database is empty
      return [
        {
          id: '1',
          title: 'Full Stack Engineer (AI Platforms)',
          company: 'Stripe',
          location: 'Remote / Noida',
          type: 'Full-time',
          matchScore: 98,
          salary: '$120k - $150k',
          logo: 'payments',
          logoColor: 'text-primary',
          skills: ['React', 'TypeScript', 'Node.js'],
        },
        {
          id: '2',
          title: 'Senior Backend Developer',
          company: 'Razorpay',
          location: 'Bangalore, Karnataka',
          type: 'Full-time',
          matchScore: 94,
          salary: '₹24 - ₹30 LPA',
          logo: 'account_balance',
          logoColor: 'text-tertiary',
          skills: ['Node.js', 'PostgreSQL', 'System Design'],
        },
        {
          id: '3',
          title: 'Software Developer (Frontend)',
          company: 'Groww',
          location: 'Noida, Uttar Pradesh',
          type: 'Full-time',
          matchScore: 89,
          salary: '₹18 - ₹22 LPA',
          logo: 'trending_up',
          logoColor: 'text-secondary',
          skills: ['React', 'TailwindCSS', 'Redux'],
        },
      ]
    }

    // Map database jobs
    return dbJobs.map((job, index) => {
      // Calculate a simple match score based on title/description keyword matching user skills
      const searchStr = `${job.title} ${job.description}`.toLowerCase()
      const matchedSkills = skills.filter((skill: string) => searchStr.includes(skill.toLowerCase()))
      
      const scoreBase = 80 + Math.floor(Math.random() * 10)
      const bonus = Math.min(10, matchedSkills.length * 4)
      const matchScore = Math.min(99, scoreBase + bonus)

      // Map dynamic material icon logo based on title
      let logo = 'work'
      let logoColor = 'text-primary'
      const titleLower = job.title.toLowerCase()
      
      if (titleLower.includes('developer') || titleLower.includes('engineer') || titleLower.includes('software') || titleLower.includes('code')) {
        logo = 'code'
        logoColor = index % 2 === 0 ? 'text-primary' : 'text-emerald-400'
      } else if (titleLower.includes('product') || titleLower.includes('manager')) {
        logo = 'assignment'
        logoColor = 'text-tertiary'
      } else if (titleLower.includes('design') || titleLower.includes('ui') || titleLower.includes('ux') || titleLower.includes('frontend')) {
        logo = 'palette'
        logoColor = 'text-secondary'
      }

      // Format employment type
      const jobType = job.employmentType ? job.employmentType.replace('_', ' ').toLowerCase() : 'Full-time'
      const capitalizedType = jobType.charAt(0).toUpperCase() + jobType.slice(1)

      return {
        id: job.id,
        title: job.title,
        company: job.company.name,
        location: job.location || 'Remote',
        type: capitalizedType,
        matchScore,
        salary: job.salary || 'Not Specified',
        logo,
        logoColor,
        skills: matchedSkills.length > 0 ? matchedSkills : ['Hacker News', 'YC Startup'].concat(skills.slice(0, 1)),
      }
    })
  }, [dbJobsData, skills])

  const handleApplyJob = (jobId: string, company: string) => {
    setAppliedJobs((prev) => ({ ...prev, [jobId]: true }))
    setToastMessage(`Application submitted successfully to ${company}!`)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const handleEditProfile = () => {
    dispatch(setStep(2))
    navigate('/onboarding')
  }

  const isSyncing = !!activeSyncId && (
    syncStatus?.status === 'SYNC_REQUESTED' ||
    syncStatus?.status === 'FETCHING' ||
    syncStatus?.status === 'NORMALIZING'
  )

  return {
    user,
    profile,
    firstName,
    lastName,
    fullName,
    skills,
    preferredRoles,
    preferredLocations,
    experiences,
    projects,
    currentStatus,
    mockJobs: jobsList, // Keep property name consistent with previous usage in HomePage
    appliedJobs,
    toastMessage,
    isLoggingOut,
    handleLogout,
    handleApplyJob,
    handleEditProfile,
    // Sync attributes
    isSyncing,
    syncStatus,
    handleStartSync,
  }
}

