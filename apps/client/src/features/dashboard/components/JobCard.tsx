import * as React from "react"

export interface JobItem {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  matchScore: number;
  salary: string;
  logo: string;
  logoColor: string;
  skills: string[];
}

interface JobCardProps {
  job: JobItem;
  isApplied: boolean;
  onApply: (jobId: string, company: string) => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, isApplied, onApply }) => {
  return (
    <div className="glass-card rounded-xl p-6 hover:-translate-y-0.5 hover:border-primary-container/30 transition-all flex flex-col md:flex-row justify-between gap-4 top-light">
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
          onClick={() => onApply(job.id, job.company)}
          disabled={isApplied}
          type="button"
          className={`px-5 py-2.5 rounded-lg text-xs font-bold transition-all active:scale-95 w-full md:w-auto text-center cursor-pointer ${
            isApplied
              ? "bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 cursor-default"
              : "glow-button text-white"
          }`}
        >
          {isApplied ? (
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
  )
}
