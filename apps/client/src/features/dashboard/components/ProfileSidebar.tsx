import * as React from "react"

interface Location {
  city: string;
  state?: string;
  country?: string;
}

interface ProfileSidebarProps {
  firstName: string;
  lastName: string;
  fullName: string;
  email?: string;
  currentStatus: string;
  preferredRoles: string[];
  preferredLocations: Location[];
  skills: string[];
  experiencesCount: number;
  projectsCount: number;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
}

export const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
  firstName,
  lastName,
  fullName,
  email,
  currentStatus,
  preferredRoles,
  preferredLocations,
  skills,
  experiencesCount,
  projectsCount,
  linkedinUrl,
  githubUrl,
  portfolioUrl,
}) => {
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

  return (
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
        <p className="text-xs text-text-muted mt-1">{email}</p>
      </div>

      {/* Profile Statistics */}
      <div className="space-y-4">
        <div>
          <p className="text-xs text-text-muted mb-2 font-semibold">Preference Details</p>
          <div className="space-y-3 bg-surface-lowest/50 p-4 rounded-xl border border-outline-variant/20 text-xs">
            <div>
              <span className="text-text-muted block mb-1">Target Roles</span>
              <div className="flex flex-wrap gap-1">
                {preferredRoles.map((role, i) => (
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
                {preferredLocations.map((loc, i) => (
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
                <span className="text-white font-bold">{experiencesCount} positions</span>
              </div>
              <div>
                <span className="text-text-muted block">Projects</span>
                <span className="text-white font-bold">{projectsCount} entries</span>
              </div>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div>
          <p className="text-xs text-text-muted mb-2 font-semibold">Core Skills</p>
          <div className="flex flex-wrap gap-1.5">
            {skills.map((skill, i) => (
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
            {linkedinUrl && (
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-surface-container hover:bg-primary-container/20 text-text-muted hover:text-white border border-outline-variant/30 flex items-center justify-center transition-colors"
                title="LinkedIn"
              >
                <span className="material-symbols-outlined text-base">public</span>
              </a>
            )}
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-surface-container hover:bg-primary-container/20 text-text-muted hover:text-white border border-outline-variant/30 flex items-center justify-center transition-colors"
                title="GitHub"
              >
                <span className="material-symbols-outlined text-base">code</span>
              </a>
            )}
            {portfolioUrl && (
              <a
                href={portfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-surface-container hover:bg-primary-container/20 text-text-muted hover:text-white border border-outline-variant/30 flex items-center justify-center transition-colors"
                title="Portfolio"
              >
                <span className="material-symbols-outlined text-base">portrait</span>
              </a>
            )}
            {!linkedinUrl && !githubUrl && !portfolioUrl && (
              <span className="text-xs text-text-muted">No links provided</span>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
