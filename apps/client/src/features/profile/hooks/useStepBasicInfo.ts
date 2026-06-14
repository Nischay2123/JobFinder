import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';
import { profileStep1Schema } from '@job-finder/shared-schemas';
import { RootState } from '../../../app/store';
import { updateDraft, setStep, setProfileSetupMode } from '../store/profileSlice';

export interface Step1FormInput {
  firstName: string;
  lastName: string;
  phone: string;
  currentStatus: 'STUDENT' | 'FRESHER' | 'WORKING_PROFESSIONAL';
}

export const useStepBasicInfo = (
  submitRef: React.MutableRefObject<(() => Promise<boolean>) | null>,
  triggerToast: (msg: string) => void
) => {
  const dispatch = useDispatch();
  const draft = useSelector((state: RootState) => state.profile.draft);

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<Step1FormInput>({
    resolver: zodResolver(profileStep1Schema),
    values: {
      firstName: draft.firstName || '',
      lastName: draft.lastName || '',
      phone: draft.phone || '',
      currentStatus: draft.currentStatus as any || '',
    },
  });

  const hasParsedData = draft.skills.length > 0 || draft.experiences.length > 0 || draft.preferredRoles.length > 0;

  // Expose validation function to parent ref
  React.useEffect(() => {
    submitRef.current = async () => {
      const isValid = await trigger();
      if (isValid) {
        dispatch(updateDraft(getValues()));
        return true;
      }
      return false;
    };
    return () => {
      submitRef.current = null;
    };
  }, [trigger, getValues, dispatch, submitRef]);

  const onSubmit = (data: Step1FormInput) => {
    dispatch(updateDraft(data));
    if (hasParsedData) {
      dispatch(setProfileSetupMode('edit'));
    }
    dispatch(setStep(2));
  };

  const onError = () => {
    triggerToast('Please fill in all required fields marked with *');
  };

  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
    onError,
  };
};
