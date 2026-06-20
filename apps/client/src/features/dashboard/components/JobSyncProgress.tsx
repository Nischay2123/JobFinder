import * as React from "react"
import { Button } from "@shared/components/ui/button"

interface JobSyncProgressProps {
  status: 'SYNC_REQUESTED' | 'FETCHING' | 'NORMALIZING' | 'COMPLETED' | 'FAILED' | null;
  jobsFound: number;
  jobsAdded: number;
  errorMessage?: string | null;
  isSyncing: boolean;
  onStartSync: () => void;
}

export const JobSyncProgress: React.FC<JobSyncProgressProps> = ({
  status,
  jobsFound,
  jobsAdded,
  errorMessage,
  isSyncing,
  onStartSync,
}) => {
  // Define helper to check state step status
  const getStepState = (step: 'requested' | 'fetching' | 'normalizing' | 'completed') => {
    if (!status) return 'pending';
    if (status === 'FAILED') return 'failed';

    const states = ['SYNC_REQUESTED', 'FETCHING', 'NORMALIZING', 'COMPLETED'];
    const currentIdx = states.indexOf(status);

    if (step === 'requested') return currentIdx >= 0 ? (currentIdx > 0 ? 'done' : 'active') : 'pending';
    if (step === 'fetching') return currentIdx >= 1 ? (currentIdx > 1 ? 'done' : 'active') : 'pending';
    if (step === 'normalizing') return currentIdx >= 2 ? (currentIdx > 2 ? 'done' : 'active') : 'pending';
    if (step === 'completed') return status === 'COMPLETED' ? 'done' : 'pending';

    return 'pending';
  };

  const renderStepIcon = (step: 'requested' | 'fetching' | 'normalizing' | 'completed') => {
    const state = getStepState(step);

    if (state === 'done') {
      return (
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 scale-100 transition-all duration-300 animate-pulse">
          <span className="material-symbols-outlined text-sm font-extrabold">check</span>
        </span>
      );
    }
    if (state === 'active') {
      return (
        <span className="relative flex h-6 w-6 items-center justify-center">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/30 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-primary border border-primary-container"></span>
        </span>
      );
    }
    if (state === 'failed') {
      return (
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500/10 text-red-400 border border-red-500/30">
          <span className="material-symbols-outlined text-sm">close</span>
        </span>
      );
    }
    return (
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-surface-container text-text-muted border border-outline-variant/30">
        <span className="h-2 w-2 rounded-full bg-text-muted/40"></span>
      </span>
    );
  };

  const getStepTextClass = (step: 'requested' | 'fetching' | 'normalizing' | 'completed') => {
    const state = getStepState(step);
    if (state === 'done') return 'text-text-primary font-medium';
    if (state === 'active') return 'text-primary font-bold animate-pulse';
    if (state === 'failed') return 'text-red-400';
    return 'text-text-muted';
  };

  return (
    <div className="glass-card rounded-2xl p-6 relative overflow-hidden top-light border border-outline-variant/20 shadow-2xl">
      {/* Background radial glow */}
      {isSyncing && (
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">sync_alt</span>
            Job Postings Sync
          </h3>
          <p className="text-xs text-text-muted mt-1 leading-relaxed">
            Fetch and parse real-time YC & Hacker News jobs to match your profile.
          </p>
        </div>

        {!isSyncing && (
          <Button
            onClick={onStartSync}
            className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-primary to-primary-container hover:from-primary/90 hover:to-primary-container/90 text-white font-bold rounded-xl shadow-lg hover:shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all text-xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm font-bold">search</span>
            Find New Jobs
          </Button>
        )}
      </div>

      {isSyncing && (
        <div className="space-y-5 mt-5 animate-in fade-in slide-in-from-top-4 duration-300">
          {/* Stepper progress lines */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-xl bg-surface-container/30 border border-outline-variant/10">
            {/* Step 1 */}
            <div className="flex items-center gap-3">
              {renderStepIcon('requested')}
              <span className={`text-xs ${getStepTextClass('requested')}`}>Sync Requested</span>
            </div>
            
            {/* Step 2 */}
            <div className="flex items-center gap-3">
              {renderStepIcon('fetching')}
              <span className={`text-xs ${getStepTextClass('fetching')}`}>Fetching Jobs</span>
            </div>

            {/* Step 3 */}
            <div className="flex items-center gap-3">
              {renderStepIcon('normalizing')}
              <span className={`text-xs ${getStepTextClass('normalizing')}`}>Storing & Saving</span>
            </div>

            {/* Step 4 */}
            <div className="flex items-center gap-3">
              {renderStepIcon('completed')}
              <span className={`text-xs ${getStepTextClass('completed')}`}>Complete</span>
            </div>
          </div>

          {/* Metrics & Counter */}
          {(status === 'FETCHING' || status === 'NORMALIZING' || status === 'COMPLETED') && (
            <div className="flex justify-around items-center py-2 px-4 rounded-xl bg-surface-container-high/20 border border-outline-variant/10 text-center animate-in fade-in duration-300">
              <div>
                <p className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Discovered</p>
                <p className="text-xl font-extrabold text-white mt-0.5">{jobsFound}</p>
              </div>
              <div className="h-8 w-px bg-outline-variant/30"></div>
              <div>
                <p className="text-[10px] text-text-muted uppercase font-bold tracking-wider">New Saved</p>
                <p className="text-xl font-extrabold text-emerald-400 mt-0.5">+{jobsAdded}</p>
              </div>
            </div>
          )}

          {/* Status Message Banners */}
          {status === 'COMPLETED' && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-in zoom-in-95 duration-200">
              <span className="material-symbols-outlined text-sm font-bold">check_circle</span>
              <span>Successfully parsed Hacker News! Synced {jobsFound} jobs, added {jobsAdded} new entries.</span>
            </div>
          )}

          {status === 'FAILED' && (
            <div className="space-y-3 animate-in zoom-in-95 duration-200">
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold flex items-start gap-2">
                <span className="material-symbols-outlined text-sm mt-0.5">error</span>
                <span className="flex-1 leading-normal">
                  Sync failed: {errorMessage || 'Internal database connector error.'}
                </span>
              </div>
              <Button
                onClick={onStartSync}
                variant="destructive"
                className="w-full py-2 bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-500/20 hover:border-red-500/40 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">replay</span>
                Retry Syncing
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
