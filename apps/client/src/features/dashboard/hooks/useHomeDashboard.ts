import * as React from "react"
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useHome } from "./useHome"
import { setStep } from '../../profile/store/profileSlice'

export const useHomeDashboard = () => {
  const { user, handleLogout, isLoggingOut } = useHome()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [appliedJobs, setAppliedJobs] = React.useState<Record<string, boolean>>({})
  const [toastMessage, setToastMessage] = React.useState<string | null>(null)

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

  // Generate dynamic mock jobs matching the user's skills/preferences
  const mockJobs = React.useMemo(() => {
    const defaultJobs = [
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

    if (preferredRoles.length > 0) {
      defaultJobs[0].title = `${preferredRoles[0]} (Core Platform)`
      if (preferredRoles.length > 1) {
        defaultJobs[1].title = `Senior ${preferredRoles[1]}`
      }
      if (preferredRoles.length > 2) {
        defaultJobs[2].title = `${preferredRoles[2]}`
      }
    }

    if (skills.length > 0) {
      defaultJobs[0].skills = skills.slice(0, 3)
      defaultJobs[1].skills = skills.slice(1, 4).concat(skills.slice(0, 1)).filter(Boolean)
      defaultJobs[2].skills = skills.slice(2, 5).concat(skills.slice(0, 2)).filter(Boolean)
    }

    if (preferredLocations.length > 0) {
      const loc = preferredLocations[0]
      const locStr = `${loc.city}, ${loc.state || loc.country}`
      defaultJobs[0].location = `Remote / ${locStr}`
      defaultJobs[1].location = locStr
      if (preferredLocations.length > 1) {
        const loc2 = preferredLocations[1]
        defaultJobs[2].location = `${loc2.city}, ${loc2.state || loc2.country}`
      }
    }

    return defaultJobs
  }, [preferredRoles, skills, preferredLocations])

  const handleApplyJob = (jobId: string, company: string) => {
    setAppliedJobs((prev) => ({ ...prev, [jobId]: true }))
    setToastMessage(`Application submitted successfully to ${company}!`)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const handleEditProfile = () => {
    dispatch(setStep(2))
    navigate('/onboarding')
  }

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
    mockJobs,
    appliedJobs,
    toastMessage,
    isLoggingOut,
    handleLogout,
    handleApplyJob,
    handleEditProfile,
  }
}
