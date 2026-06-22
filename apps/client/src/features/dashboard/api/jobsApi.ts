import { baseApi } from '@shared/api/baseApi';

export interface StartSyncResponse {
  syncId: string;
  status?: 'already_running';
}

export interface SyncStatusResponse {
  id: string;
  status: 'SYNC_REQUESTED' | 'FETCHING' | 'NORMALIZING' | 'COMPLETED' | 'FAILED';
  jobsFound: number;
  jobsAdded: number;
  errorMessage?: string | null;
}

export interface ReplayFailedResponse {
  message: string;
  failedJobId: string;
  replayCount: number;
}

export interface DBJob {
  id: string;
  companyId: string;
  company: {
    id: string;
    name: string;
    website?: string | null;
  };
  source: 'YC' | 'WELLFOUND' | 'INSTAHYRE' | 'CUTSHORT' | 'LINKEDIN' | 'NAUKRI';
  sourceJobId?: string | null;
  title: string;
  description: string;
  location?: string | null;
  remoteType: 'REMOTE' | 'HYBRID' | 'ONSITE' | 'UNKNOWN';
  applyUrl: string;
  experienceRequired?: string | null;
  employmentType?: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERN' | null;
  salary?: string | null;
  postedDate?: string | null;
  discoveredAt: string;
  expiresAt?: string | null;
  status: 'ACTIVE' | 'INACTIVE' | 'DELETED';
  processingStatus: 'PENDING' | 'PROCESSED' | 'FAILED';
  jobHash: string;
}

export interface GetJobsResponse {
  jobs: DBJob[];
}

export const jobsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    startJobSync: builder.mutation<StartSyncResponse, void>({
      query: () => ({
        url: '/jobs/sync',
        method: 'POST',
      }),
    }),
    getSyncStatus: builder.query<SyncStatusResponse, string>({
      query: (syncId) => ({
        url: `/syncs/${syncId}`,
        method: 'GET',
      }),
    }),
    replayFailedJob: builder.mutation<ReplayFailedResponse, string>({
      query: (id) => ({
        url: `/failed-jobs/${id}/replay`,
        method: 'POST',
      }),
    }),
    getJobs: builder.query<GetJobsResponse, void>({
      query: () => ({
        url: '/jobs',
        method: 'GET',
      }),
      providesTags: ['Jobs'],
    }),
  }),
});

export const {
  useStartJobSyncMutation,
  useGetSyncStatusQuery,
  useReplayFailedJobMutation,
  useGetJobsQuery,
} = jobsApi;
