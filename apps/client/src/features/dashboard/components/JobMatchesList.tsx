import * as React from "react"
import { JobCard, JobItem } from "./JobCard"

interface JobMatchesListProps {
  mockJobs: JobItem[];
  appliedJobs: Record<string, boolean>;
  onApplyJob: (jobId: string, company: string) => void;
}

export const JobMatchesList: React.FC<JobMatchesListProps> = ({
  mockJobs,
  appliedJobs,
  onApplyJob,
}) => {
  return (
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
          <JobCard 
            key={job.id} 
            job={job} 
            isApplied={!!appliedJobs[job.id]} 
            onApply={onApplyJob} 
          />
        ))}
      </div>
    </section>
  )
}
