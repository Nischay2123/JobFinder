import * as React from "react"
import { useHomeDashboard } from "../hooks/useHomeDashboard"
import { HomeNavbar } from "../components/HomeNavbar"
import { HomeMetrics } from "../components/HomeMetrics"
import { JobMatchesList } from "../components/JobMatchesList"
import { ProfileSidebar } from "../components/ProfileSidebar"

export const HomePage: React.FC = () => {
  const {
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
  } = useHomeDashboard()

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
      <HomeNavbar 
        onEditProfile={handleEditProfile} 
        onLogout={handleLogout} 
        isLoggingOut={isLoggingOut} 
      />

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
          <HomeMetrics matchedRolesCount={mockJobs.length} />

          {/* Matching Jobs Center */}
          <JobMatchesList 
            mockJobs={mockJobs} 
            appliedJobs={appliedJobs} 
            onApplyJob={handleApplyJob} 
          />
        </div>

        {/* Right Column: User Profile Overview Card */}
        <div className="lg:col-span-4 space-y-8">
          <ProfileSidebar 
            firstName={firstName} 
            lastName={lastName} 
            fullName={fullName} 
            email={user?.email} 
            currentStatus={currentStatus} 
            preferredRoles={preferredRoles} 
            preferredLocations={preferredLocations} 
            skills={skills} 
            experiencesCount={experiences.length} 
            projectsCount={projects.length} 
            linkedinUrl={profile?.linkedinUrl} 
            githubUrl={profile?.githubUrl} 
            portfolioUrl={profile?.portfolioUrl} 
          />
        </div>
      </main>
    </div>
  )
}

export default HomePage;
