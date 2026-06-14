import * as React from "react"

interface HomeMetricsProps {
  matchedRolesCount: number;
}

export const HomeMetrics: React.FC<HomeMetricsProps> = ({ matchedRolesCount }) => {
  return (
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
          <p className="text-base font-bold text-white">{matchedRolesCount} Active Matches</p>
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
  )
}
