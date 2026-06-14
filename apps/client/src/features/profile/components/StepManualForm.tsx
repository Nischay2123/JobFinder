import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
import { updateDraft, setStep, setProfileSetupMode } from '../store/profileSlice';
import { JobPreferencesSection } from './Step2Manual/JobPreferencesSection';
import { ProfessionalLinksSection } from './Step2Manual/ProfessionalLinksSection';
import { WorkExperienceSection } from './Step2Manual/WorkExperienceSection';
import { PersonalProjectsSection } from './Step2Manual/PersonalProjectsSection';

interface ExperienceInput {
  companyName: string;
  role: string;
  employmentType?: string;
  startDate: string;
  endDate?: string | null;
  isCurrent: boolean;
  description?: string;
}

interface ProjectInput {
  title: string;
  description?: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
}

interface LocationInput {
  city: string;
  state: string;
  country: string;
}

export interface ManualFormInputs {
  preferredRoles: string[];
  preferredLocations: LocationInput[];
  skills: string[];
  linkedinUrl: string;
  githubUrl: string;
  portfolioUrl: string;
  experienceYears: number | null;
  experiences: ExperienceInput[];
  projects: ProjectInput[];
}

interface StepManualFormProps {
  submitRef: React.MutableRefObject<(() => Promise<boolean>) | null>;
  triggerToast: (msg: string) => void;
}

export const StepManualForm: React.FC<StepManualFormProps> = ({ submitRef, triggerToast }) => {
  const dispatch = useDispatch();
  const draft = useSelector((state: RootState) => state.profile.draft);

  const methods = useForm<ManualFormInputs>({
    values: {
      preferredRoles: draft.preferredRoles || [],
      preferredLocations: draft.preferredLocations || [],
      skills: draft.skills || [],
      linkedinUrl: draft.linkedinUrl || '',
      githubUrl: draft.githubUrl || '',
      portfolioUrl: draft.portfolioUrl || '',
      experienceYears: draft.experienceYears ?? null,
      experiences: (draft.experiences || []).map((exp: any) => {
        const formatLocalYM = (dateStr?: string | null) => {
          if (!dateStr) return '';
          const d = new Date(dateStr);
          if (isNaN(d.getTime())) return '';
          const year = d.getFullYear();
          const month = String(d.getMonth() + 1).padStart(2, '0');
          return `${year}-${month}`;
        };
        return {
          ...exp,
          startDate: formatLocalYM(exp.startDate),
          endDate: formatLocalYM(exp.endDate),
        };
      }),
      projects: draft.projects || [],
    },
  });

  const { handleSubmit, trigger, getValues, setError, clearErrors } = methods;

  React.useEffect(() => {
    submitRef.current = async () => {
      let isValid = true;
      const data = getValues();

      if (!data.preferredRoles || data.preferredRoles.length === 0) {
        setError('preferredRoles', { type: 'manual', message: 'At least one preferred role is required' });
        isValid = false;
      } else {
        clearErrors('preferredRoles');
      }

      const formValid = await trigger();
      if (!formValid) {
        isValid = false;
      }

      if (isValid) {
        dispatch(
          updateDraft({
            preferredRoles: data.preferredRoles,
            preferredLocations: data.preferredLocations,
            skills: data.skills,
            linkedinUrl: data.linkedinUrl,
            githubUrl: data.githubUrl,
            portfolioUrl: data.portfolioUrl,
            experienceYears: data.experienceYears,
            experiences: data.experiences.map((exp) => ({
              ...exp,
              startDate: exp.startDate ? new Date(exp.startDate).toISOString() : '',
              endDate: exp.endDate ? new Date(exp.endDate).toISOString() : null,
            })),
            projects: data.projects,
          })
        );
        return true;
      }
      triggerToast('Please fill in all required fields marked with *');
      return false;
    };
    return () => {
      submitRef.current = null;
    };
  }, [trigger, getValues, setError, clearErrors, dispatch, submitRef, triggerToast]);

  const onSubmit = (data: ManualFormInputs) => {
    if (!data.preferredRoles || data.preferredRoles.length === 0) {
      setError('preferredRoles', { type: 'manual', message: 'At least one preferred role is required' });
      triggerToast('Please fill in all required fields marked with *');
      return;
    }
    clearErrors('preferredRoles');

    dispatch(
      updateDraft({
        preferredRoles: data.preferredRoles,
        preferredLocations: data.preferredLocations,
        skills: data.skills,
        linkedinUrl: data.linkedinUrl,
        githubUrl: data.githubUrl,
        portfolioUrl: data.portfolioUrl,
        experienceYears: data.experienceYears,
        experiences: data.experiences.map((exp) => ({
          ...exp,
          startDate: exp.startDate ? new Date(exp.startDate).toISOString() : '',
          endDate: exp.endDate ? new Date(exp.endDate).toISOString() : null,
        })),
        projects: data.projects,
      })
    );
    dispatch(setStep(3));
  };

  return (
    <FormProvider {...methods}>
      <div className="w-full max-w-3xl glass-card rounded-xl p-6 md:p-10 top-light">
        <div className="mb-8">
          <h1 className="font-display-lg text-display-lg text-white mb-2 font-bold text-3xl">
            Professional Profile
          </h1>
          <p className="font-body-md text-body-md text-gray-300">
            Tell us more about your career history and aspirations to find your perfect fit.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit, () => triggerToast('Please fill in all required fields marked with *'))} className="space-y-10">
          <JobPreferencesSection />
          <ProfessionalLinksSection />
          <WorkExperienceSection />
          <PersonalProjectsSection />

          {/* Navigation Buttons */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center pt-8">
            <button
              onClick={() => dispatch(setProfileSetupMode('upload'))}
              type="button"
              className="order-2 md:order-1 px-6 py-3 rounded-lg border border-outline-variant font-label-md text-white hover:bg-surface-container-high transition-colors w-full md:w-auto cursor-pointer font-semibold"
            >
              Back to Upload
            </button>
            <button
              type="submit"
              className="order-1 md:order-2 px-12 py-3 rounded-lg bg-primary-container text-on-primary-container font-label-md glow-button shadow-[0_8px_16px_rgba(94,106,210,0.3)] w-full md:w-auto text-white font-bold cursor-pointer"
            >
              Continue to Review
            </button>
          </div>
        </form>
      </div>
    </FormProvider>
  );
};
export default StepManualForm;
