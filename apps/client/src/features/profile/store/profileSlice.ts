import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Location } from '@job-finder/shared-types';

export interface ProfileDraftState {
  firstName: string;
  lastName: string;
  phone: string;
  currentStatus: 'STUDENT' | 'FRESHER' | 'WORKING_PROFESSIONAL' | '';
  experienceYears: number | null;
  preferredRoles: string[];
  preferredLocations: Location[];
  skills: string[];
  linkedinUrl: string;
  githubUrl: string;
  portfolioUrl: string;
  resumeUrl: string;
  experiences: any[];
  projects: any[];
}

export interface ProfileState {
  currentStep: number;
  onboardingMethod: 'resume' | 'manual' | null;
  profileSetupMode: 'upload' | 'edit';
  draft: ProfileDraftState;
}

const loadSavedState = (): ProfileState | null => {
  try {
    const saved = sessionStorage.getItem('jobfinder_onboarding_state');
    return saved ? JSON.parse(saved) : null;
  } catch (e) {
    console.error('Failed to load saved onboarding state from sessionStorage', e);
    return null;
  }
};

const savedState = loadSavedState();
const initialState: ProfileState = savedState || {
  currentStep: 1,
  onboardingMethod: null,
  profileSetupMode: 'upload',
  draft: {
    firstName: '',
    lastName: '',
    phone: '',
    currentStatus: '',
    experienceYears: null,
    preferredRoles: [],
    preferredLocations: [],
    skills: [],
    linkedinUrl: '',
    githubUrl: '',
    portfolioUrl: '',
    resumeUrl: '',
    experiences: [],
    projects: [],
  },
};

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
    setOnboardingMethod: (state, action: PayloadAction<'resume' | 'manual' | null>) => {
      state.onboardingMethod = action.payload;
    },
    setProfileSetupMode: (state, action: PayloadAction<'upload' | 'edit'>) => {
      state.profileSetupMode = action.payload;
    },
    updateDraft: (state, action: PayloadAction<Partial<ProfileDraftState>>) => {
      state.draft = {
        ...state.draft,
        ...action.payload,
      };
    },
    resetOnboardingState: (state) => {
      state.currentStep = 1;
      state.onboardingMethod = null;
      state.profileSetupMode = 'upload';
      state.draft = {
        firstName: '',
        lastName: '',
        phone: '',
        currentStatus: '',
        experienceYears: null,
        preferredRoles: [],
        preferredLocations: [],
        skills: [],
        linkedinUrl: '',
        githubUrl: '',
        portfolioUrl: '',
        resumeUrl: '',
        experiences: [],
        projects: [],
      };
      try {
        sessionStorage.removeItem('jobfinder_onboarding_state');
      } catch (e) {
        console.error('Failed to remove onboarding state from sessionStorage', e);
      }
    },
  },
});

export const { setStep, setOnboardingMethod, setProfileSetupMode, updateDraft, resetOnboardingState } = profileSlice.actions;
export default profileSlice.reducer;
