import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../../app/store';
import { useSaveOnboardingMutation } from '../api/profileApi';
import { setStep, resetOnboardingState } from '../store/profileSlice';
import { setCredentials } from '@features/auth';

export const useReviewSubmit = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const draft = useSelector((state: RootState) => state.profile.draft);
  const user = useSelector((state: RootState) => state.auth.user);

  const [saveOnboarding, { isLoading }] = useSaveOnboardingMutation();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleEditSection = (stepNum: number) => {
    dispatch(setStep(stepNum));
  };

  const handleSubmitProfile = async () => {
    setErrorMsg(null);

    const payload = {
      firstName: draft.firstName,
      lastName: draft.lastName,
      phone: draft.phone,
      currentStatus: draft.currentStatus as 'STUDENT' | 'FRESHER' | 'WORKING_PROFESSIONAL',
      experienceYears: draft.experienceYears,
      preferredRoles: draft.preferredRoles,
      preferredLocations: draft.preferredLocations.map((loc: any) => ({
        city: loc.city,
        state: loc.state || '',
        country: loc.country || 'India',
      })),
      skills: draft.skills,
      linkedinUrl: draft.linkedinUrl || undefined,
      githubUrl: draft.githubUrl || undefined,
      portfolioUrl: draft.portfolioUrl || undefined,
      resumeUrl: draft.resumeUrl || undefined,
      experiences: draft.experiences.map((exp: any) => ({
        companyName: exp.companyName,
        role: exp.role,
        employmentType: exp.employmentType || 'Full-time',
        startDate: exp.startDate,
        endDate: exp.endDate,
        isCurrent: exp.isCurrent,
        description: exp.description || undefined,
      })),
      projects: draft.projects.map((proj: any) => ({
        title: proj.title,
        description: proj.description || undefined,
        technologies: proj.technologies || [],
        githubUrl: proj.githubUrl || undefined,
        liveUrl: proj.liveUrl || undefined,
      })),
    };

    try {
      const response = await saveOnboarding(payload).unwrap();
      if (user) {
        dispatch(
          setCredentials({
            user: {
              ...user,
              profile: response.profile,
            },
          })
        );
      }
      dispatch(resetOnboardingState());
      navigate('/home');
    } catch (err: any) {
      console.error('Save onboarding failed:', err);
      setErrorMsg(err.data?.message || 'Failed to complete onboarding. Please verify all details.');
    }
  };

  return {
    draft,
    isLoading,
    errorMsg,
    handleEditSection,
    handleSubmitProfile,
  };
};
export default useReviewSubmit;
