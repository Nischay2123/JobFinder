import * as React from "react"
import { useHome } from "../hooks/useHome"
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setStep } from '../../profile/store/profileSlice'
import { Button } from "@shared/components/ui/button"

export const HomePage: React.FC = () => {
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

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'STUDENT':
        return 'Student'
      case 'FRESHER':
        return 'Fresher'
      case 'WORKING_PROFESSIONAL':
        return 'Working Professional'
      default:
        return status
    }
  }

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
    // Navigate back to onboarding at Step 2 (form edit)
    dispatch(setStep(2))
    navigate('/onboarding')
  }

  return (
    <div className="dark min-h-screen bg-[#08090a] text-text-primary flex flex-col relative overflow-x-hidden pb-12">
      {/* Decorative background flows */}
      <div className="atmospheric-bg"></div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 flex items-center gap-3 bg-surface-container border border-primary-container/40 px-5 py-4 rounded-xl shadow-2xl animate-in slide-in-from-right duration-300">
          <span className="material-symbols-outlined text-primary-container">check_circle</span>
          <span className="text-sm font-semibold text-white">{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#08090a]/80 backdrop-blur-md border-b border-outline-variant/30">
        <div className="flex justify-between items-center w-full px-6 max-w-[1280px] mx-auto h-16">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-2xl font-bold">rocket_launch</span>
            <span className="font-headline-md text-headline-md font-bold text-white text-xl tracking-tight">
              JobFinder<span className="text-primary-container">AI</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleEditProfile}
              type="button"
              className="text-xs font-semibold px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 hover:border-primary-container/40 transition-all cursor-pointer text-white flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">edit</span>
              Edit Profile
            </button>

            <Button
              onClick={handleLogout}
              disabled={isLoggingOut}
              variant="destructive"
              className="px-4 py-2 h-auto text-xs bg-red-600/10 hover:bg-red-600/20 text-red-500 border border-red-500/20 hover:border-red-500/40 active:scale-95 transition-all font-semibold rounded-lg cursor-pointer"
            >
              {isLoggingOut ? "Logging out..." : "Log Out"}
            </Button>
          </div>
        </div>
      </header>

      {/* Dashboard Content Grid */}
      <main className="flex-grow w-full max-w-[1280px] mx-auto px-6 pt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Greeting and Job Matches */}
        <div className="lg:col-span-8 space-y-8">
          {/* Greeting Hero */}
          <section className="glass-card rounded-2xl p-8 relative overflow-hidden top-light">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary-container/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-primary-container">Dashboard overview</span>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">
                Welcome home, {firstName}!
              </h2>
              <p className="text-sm text-text-muted leading-relaxed max-w-xl">
                We've processed your resume details and set up your candidate profile. Below are the most relevant job postings matched by our AI models based on your skillset.
              </p>
            </div>
          </section>

          {/* Quick Metrics */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass-card rounded-xl p-5 flex items-center gap-4 top-light">
              <div className="p-3 rounded-lg bg-primary/10 text-primary">
                <span className="material-symbols-outlined text-2xl">task_alt</span>
              </div>
              <div>
                <p className="text-xs text-text-muted font-semibold">Profile Status</p>
                <p className="text-base font-bold text-white">100% Complete</p>
              </div>
            </div>
            <div className="glass-card rounded-xl p-5 flex items-center gap-4 top-light">
              <div className="p-3 rounded-lg bg-tertiary-container/20 text-tertiary">
                <span className="material-symbols-outlined text-2xl">hub</span>
              </div>
              <div>
                <p className="text-xs text-text-muted font-semibold">Matched Roles</p>
                <p className="text-base font-bold text-white">{mockJobs.length} Active Matches</p>
              </div>
            </div>
            <div className="glass-card rounded-xl p-5 flex items-center gap-4 top-light">
              <div className="p-3 rounded-lg bg-secondary-container/20 text-secondary">
                <span className="material-symbols-outlined text-2xl">insights</span>
              </div>
              <div>
                <p className="text-xs text-text-muted font-semibold">Profile Impressions</p>
                <p className="text-base font-bold text-white">32 Views/week</p>
              </div>
            </div>
          </section>

          {/* Matching Jobs Center */}
          <section className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">work</span>
                AI-Recommended Job Matches
              </h3>
              <span className="text-xs text-primary-container font-semibold">Sort by Match Score</span>
            </div>

            <div className="space-y-4">
              {mockJobs.map((job) => (
                <div key={job.id} className="glass-card rounded-xl p-6 hover:-translate-y-0.5 hover:border-primary-container/30 transition-all flex flex-col md:flex-row justify-between gap-4 top-light">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center border border-outline-variant/30 flex-shrink-0">
                      <span className={`material-symbols-outlined text-2xl ${job.logoColor}`}>{job.logo}</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-bold text-white text-base hover:text-primary transition-colors cursor-pointer">{job.title}</h4>
                        <span className="px-2 py-0.5 bg-primary/10 text-primary border border-primary/25 rounded-full text-[10px] font-bold">
                          {job.matchScore}% Match
                        </span>
                      </div>
                      <p className="text-sm text-text-secondary font-medium">{job.company}</p>
                      
                      {/* Job details */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-xs text-text-muted font-medium">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">location_on</span>
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">schedule</span>
                          {job.type}
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">payments</span>
                          {job.salary}
                        </span>
                      </div>

                      {/* Matched skills tags */}
                      <div className="flex flex-wrap gap-1.5 pt-3">
                        {job.skills.map((skill, i) => (
                          <span key={i} className="px-2 py-0.5 bg-surface-container text-xs rounded text-white border border-outline-variant/30 font-semibold">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center md:justify-end mt-2 md:mt-0">
                    <button
                      onClick={() => handleApplyJob(job.id, job.company)}
                      disabled={appliedJobs[job.id]}
                      type="button"
                      className={`px-5 py-2.5 rounded-lg text-xs font-bold transition-all active:scale-95 w-full md:w-auto text-center cursor-pointer ${
                        appliedJobs[job.id]
                          ? "bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 cursor-default"
                          : "glow-button text-white"
                      }`}
                    >
                      {appliedJobs[job.id] ? (
                        <span className="flex items-center justify-center gap-1.5">
                          <span className="material-symbols-outlined text-sm">check_circle</span>
                          Applied
                        </span>
                      ) : (
                        "Easy Apply"
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: User Profile Overview Card */}
        <div className="lg:col-span-4 space-y-8">
          <section className="glass-card rounded-2xl p-6 top-light space-y-6 relative overflow-hidden">
            <div className="absolute -bottom-12 -left-12 w-28 h-28 bg-primary-container/5 rounded-full blur-2xl pointer-events-none"></div>

            {/* Profile Header */}
            <div className="flex flex-col items-center text-center pb-4 border-b border-outline-variant/30 gap-3">
              <div className="w-16 h-16 rounded-full bg-primary-container text-white flex items-center justify-center font-bold text-2xl border-2 border-primary shadow-lg uppercase">
                {firstName[0]}
                {lastName ? lastName[0] : ""}
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-white text-lg leading-tight">{fullName}</h3>
                <span className="inline-block px-3 py-0.5 bg-secondary-container/30 text-secondary border border-secondary/20 rounded-full text-xs font-semibold">
                  {getStatusLabel(currentStatus)}
                </span>
              </div>
              <p className="text-xs text-text-muted mt-1">{user?.email}</p>
            </div>

            {/* Profile Statistics */}
            <div className="space-y-4">
              <div>
                <p className="text-xs text-text-muted mb-2 font-semibold">Preference Details</p>
                <div className="space-y-3 bg-surface-lowest/50 p-4 rounded-xl border border-outline-variant/20 text-xs">
                  <div>
                    <span className="text-text-muted block mb-1">Target Roles</span>
                    <div className="flex flex-wrap gap-1">
                      {preferredRoles.map((role: any, i: number) => (
                        <span key={i} className="px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded-full text-[10px] font-bold">
                          {role}
                        </span>
                      ))}
                      {preferredRoles.length === 0 && <span className="text-text-muted">-</span>}
                    </div>
                  </div>
                  <div>
                    <span className="text-text-muted block mb-1">Target Cities</span>
                    <div className="flex flex-wrap gap-1">
                      {preferredLocations.map((loc: any, i: number) => (
                        <span key={i} className="px-2 py-0.5 bg-tertiary-container/20 text-tertiary border border-tertiary/20 rounded-full text-[10px] font-bold">
                          {loc.city}
                        </span>
                      ))}
                      {preferredLocations.length === 0 && <span className="text-text-muted">-</span>}
                    </div>
                  </div>
                  <div className="border-t border-outline-variant/20 pt-2 grid grid-cols-2 gap-2 text-[10px]">
                    <div>
                      <span className="text-text-muted block">Work History</span>
                      <span className="text-white font-bold">{experiences.length} positions</span>
                    </div>
                    <div>
                      <span className="text-text-muted block">Projects</span>
                      <span className="text-white font-bold">{projects.length} entries</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div>
                <p className="text-xs text-text-muted mb-2 font-semibold">Core Skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((skill: any, i: number) => (
                    <span key={i} className="px-2.5 py-0.5 bg-secondary-container/20 text-secondary border border-secondary/30 rounded-full text-xs font-semibold">
                      {skill}
                    </span>
                  ))}
                  {skills.length === 0 && <span className="text-xs text-text-muted">No skills saved</span>}
                </div>
              </div>

              {/* Social Links */}
              <div className="pt-2">
                <p className="text-xs text-text-muted mb-2.5 font-semibold">Professional Networks</p>
                <div className="flex gap-3">
                  {profile?.linkedinUrl && (
                    <a
                      href={profile.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-lg bg-surface-container hover:bg-primary-container/20 text-text-muted hover:text-white border border-outline-variant/30 flex items-center justify-center transition-colors"
                      title="LinkedIn"
                    >
                      <span className="material-symbols-outlined text-base">public</span>
                    </a>
                  )}
                  {profile?.githubUrl && (
                    <a
                      href={profile.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-lg bg-surface-container hover:bg-primary-container/20 text-text-muted hover:text-white border border-outline-variant/30 flex items-center justify-center transition-colors"
                      title="GitHub"
                    >
                      <span className="material-symbols-outlined text-base">code</span>
                    </a>
                  )}
                  {profile?.portfolioUrl && (
                    <a
                      href={profile.portfolioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-lg bg-surface-container hover:bg-primary-container/20 text-text-muted hover:text-white border border-outline-variant/30 flex items-center justify-center transition-colors"
                      title="Portfolio"
                    >
                      <span className="material-symbols-outlined text-base">portrait</span>
                    </a>
                  )}
                  {!profile?.linkedinUrl && !profile?.githubUrl && !profile?.portfolioUrl && (
                    <span className="text-xs text-text-muted">No links provided</span>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

