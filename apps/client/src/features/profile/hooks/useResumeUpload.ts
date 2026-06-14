import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useUploadResumeMutation } from '../api/profileApi';
import { updateDraft, setStep, setOnboardingMethod, setProfileSetupMode } from '../store/profileSlice';
import { RootState } from '../../../app/store';

export const useResumeUpload = () => {
  const dispatch = useDispatch();
  const draft = useSelector((state: RootState) => state.profile.draft);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [uploadResume, { isLoading }] = useUploadResumeMutation();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processFile = async (file: File) => {
    if (file.type !== 'application/pdf') {
      setErrorMsg('Only PDF files are supported for AI resume auto-extraction.');
      return;
    }
    setErrorMsg(null);

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await uploadResume(formData).unwrap();
      const extracted = response.extractedData;

      dispatch(
        updateDraft({
          firstName: extracted.firstName || '',
          lastName: extracted.lastName || '',
          phone: extracted.phone || '',
          experienceYears: extracted.experienceYears || null,
          skills: extracted.skills || [],
          preferredRoles: extracted.preferredRoles || [],
          preferredLocations: extracted.preferredLocations || [],
          linkedinUrl: extracted.linkedinUrl || '',
          githubUrl: extracted.githubUrl || '',
          portfolioUrl: extracted.portfolioUrl || '',
          resumeUrl: response.resumeUrl || '',
          experiences: extracted.experiences || [],
          projects: extracted.projects || [],
        })
      );
      dispatch(setOnboardingMethod('resume'));
      dispatch(setProfileSetupMode('edit'));
    } catch (err: any) {
      console.error('Upload failed:', err);
      setErrorMsg(err.data?.message || 'Failed to parse resume. Please try again or fill manually.');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleManualPath = () => {
    dispatch(setOnboardingMethod('manual'));
    dispatch(setProfileSetupMode('edit'));
  };

  const handleBackToStep1 = () => {
    dispatch(setStep(1));
  };

  const hasParsedData = draft.skills.length > 0 || draft.experiences.length > 0 || draft.preferredRoles.length > 0;

  return {
    isLoading,
    dragActive,
    errorMsg,
    fileInputRef,
    hasParsedData,
    setErrorMsg,
    handleDrag,
    handleDrop,
    handleChange,
    onButtonClick,
    handleManualPath,
    handleBackToStep1,
  };
};
export default useResumeUpload;
