import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../../app/store';
import { setStep, updateDraft, setProfileSetupMode } from '../store/profileSlice';

export const useOnboardingPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentStep = useSelector((state: RootState) => state.profile.currentStep);
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const draft = useSelector((state: RootState) => state.profile.draft);
  const profileSetupMode = useSelector((state: RootState) => state.profile.profileSetupMode);

  // Ref to hold the active child component's validation/save callback
  const stepSubmitRef = useRef<(() => Promise<boolean>) | null>(null);

  // Validation Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 3000);
    return () => clearTimeout(timer);
  };

  // Redirect unauthenticated or completed users
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth/login', { replace: true });
    } else if (user && user.profile && user.profile.isCompleted) {
      navigate('/home', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  // Pre-seed profile draft fields from user context on mount
  useEffect(() => {
    if (user && user.profile) {
      const dbProfile = user.profile;
      if (!draft.firstName || !draft.currentStatus) {
        dispatch(
          updateDraft({
            firstName: draft.firstName || dbProfile.firstName || user.name.split(' ')[0] || '',
            lastName: draft.lastName || dbProfile.lastName || user.name.split(' ')[1] || '',
            phone: draft.phone || dbProfile.phone || '',
            currentStatus: (draft.currentStatus || dbProfile.currentStatus || '') as any,
          })
        );
      }
    }
  }, [user, dispatch, draft.firstName, draft.currentStatus]);

  const handleStepChange = async (targetStep: number) => {
    if (targetStep === currentStep) return;

    // 1. Navigating backward: save current progress silently, then proceed
    if (targetStep < currentStep) {
      if (stepSubmitRef.current) {
        await stepSubmitRef.current(); // saves draft silently
      }
      dispatch(setStep(targetStep));
      return;
    }

    // 2. Navigating forward: run active step validation
    if (currentStep === 1) {
      if (stepSubmitRef.current) {
        const isValid = await stepSubmitRef.current();
        if (!isValid) {
          triggerToast('Please fill in all required fields marked with *');
          return; // block navigation if Step 1 is invalid
        }
      }
    }

    if (currentStep === 2) {
      if (profileSetupMode === 'edit') {
        if (stepSubmitRef.current) {
          const isValid = await stepSubmitRef.current();
          if (!isValid) {
            triggerToast('Please fill in all required fields marked with *');
            return; // block navigation if Step 2 manual form has invalid/missing fields
          }
        }
      } else {
        // If in 'upload' mode and attempting to skip to Review, verify if we have preferredRoles
        if (targetStep === 3) {
          if (!draft.preferredRoles || draft.preferredRoles.length === 0) {
            triggerToast('Please fill in preferred roles before reviewing');
            // Force user into edit mode to add required fields (Preferred Roles)
            dispatch(setProfileSetupMode('edit'));
            return;
          }
        }
      }
    }

    // Double check that Step 1 is completely valid before allowing Step 3 Review loading
    if (targetStep === 3) {
      if (!draft.firstName || !draft.lastName || !draft.phone || !draft.currentStatus) {
        triggerToast('Please complete basic info first');
        dispatch(setStep(1));
        return;
      }
    }

    dispatch(setStep(targetStep));
  };

  const getStepProgress = () => {
    switch (currentStep) {
      case 1:
        return { text: 'Step 1 of 3', percentage: '33%', widthClass: 'w-1/3' };
      case 2:
        return { text: 'Step 2 of 3', percentage: '66%', widthClass: 'w-2/3' };
      case 3:
        return { text: 'Step 3 of 3', percentage: '95%', widthClass: 'w-[95%]' };
      default:
        return { text: 'Step 1 of 3', percentage: '33%', widthClass: 'w-1/3' };
    }
  };

  const progress = getStepProgress();

  return {
    currentStep,
    profileSetupMode,
    toastMessage,
    progress,
    stepSubmitRef,
    triggerToast,
    handleStepChange,
  };
};
