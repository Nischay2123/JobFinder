import { baseApi } from '@shared/api/baseApi';
import { UserProfile } from '@job-finder/shared-types';

export interface UploadResumeResponse {
  message: string;
  resumeUrl: string;
  extractedData: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    experienceYears?: number;
    linkedinUrl?: string;
    githubUrl?: string;
    portfolioUrl?: string;
    skills?: string[];
    preferredRoles?: string[];
    preferredLocations?: Array<{
      city: string;
      state: string;
      country: string;
    }>;
    experiences?: Array<{
      companyName: string;
      role: string;
      employmentType?: string;
      startDate: string;
      endDate?: string | null;
      isCurrent: boolean;
      description?: string;
    }>;
    projects?: Array<{
      title: string;
      description?: string;
      technologies: string[];
      githubUrl?: string;
      liveUrl?: string;
    }>;
  };
}

export interface SaveOnboardingInput {
  firstName: string;
  lastName: string;
  phone: string;
  currentStatus: 'STUDENT' | 'FRESHER' | 'WORKING_PROFESSIONAL';
  experienceYears?: number | null;
  preferredRoles: string[];
  preferredLocations: Array<{
    city: string;
    state: string;
    country: string;
  }>;
  skills: string[];
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  resumeUrl?: string;
  experiences?: Array<{
    companyName: string;
    role: string;
    employmentType?: string;
    startDate: string;
    endDate?: string | null;
    isCurrent: boolean;
    description?: string;
  }>;
  projects?: Array<{
    title: string;
    description?: string;
    technologies: string[];
    githubUrl?: string;
    liveUrl?: string;
  }>;
}

export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadResume: builder.mutation<UploadResumeResponse, FormData>({
      query: (formData) => ({
        url: '/profile/upload-resume',
        method: 'POST',
        body: formData,
      }),
    }),
    saveOnboarding: builder.mutation<{ message: string; profile: UserProfile }, SaveOnboardingInput>({
      query: (body) => ({
        url: '/profile/save-onboarding',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Auth'],
    }),
    getMyProfile: builder.query<{ profile: UserProfile }, void>({
      query: () => ({
        url: '/profile/me',
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useUploadResumeMutation,
  useSaveOnboardingMutation,
  useGetMyProfileQuery,
} = profileApi;
