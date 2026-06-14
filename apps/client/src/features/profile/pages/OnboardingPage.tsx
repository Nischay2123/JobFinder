import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../../app/store';
import { StepBasicInfo } from '../components/StepBasicInfo';
import { StepResumeUpload } from '../components/StepResumeUpload';
import { StepManualForm } from '../components/StepManualForm';
import { StepReviewSubmit } from '../components/StepReviewSubmit';
import { setStep, updateDraft, setProfileSetupMode } from '../store/profileSlice';

export const OnboardingPage: React.FC = () => {
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

  const renderActiveStep = () => {
    switch (currentStep) {
      case 1:
        return <StepBasicInfo submitRef={stepSubmitRef} triggerToast={triggerToast} />;
      case 2:
        return profileSetupMode === 'upload'
          ? <StepResumeUpload />
          : <StepManualForm submitRef={stepSubmitRef} triggerToast={triggerToast} />;
      case 3:
        return <StepReviewSubmit />;
      default:
        return <StepBasicInfo submitRef={stepSubmitRef} triggerToast={triggerToast} />;
    }
  };

  const progress = getStepProgress();

  return (
    <div className="min-h-screen flex flex-col font-body-md text-body-md bg-background overflow-x-hidden relative">
      {/* Background Decorative Gradients */}
      <div className="atmospheric-bg"></div>

      {/* Validation Toast Message */}
      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 flex items-center gap-3 bg-red-950/90 backdrop-blur-md border border-red-500/30 px-5 py-4 rounded-xl shadow-2xl animate-in slide-in-from-right duration-300">
          <span className="material-symbols-outlined text-red-400">warning</span>
          <span className="text-sm font-semibold text-red-200">{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="flex justify-between items-center w-full px-4 md:px-6 max-w-[1200px] mx-auto h-16">
          <div className="font-headline-md text-headline-md font-bold text-primary text-xl">
            JobFinder
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <button
              type="button"
              onClick={() => handleStepChange(1)}
              className={`font-body-md text-body-md transition-colors duration-200 cursor-pointer ${
                currentStep === 1
                  ? 'text-primary font-bold border-b-2 border-primary pb-1'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Basic Info
            </button>
            <button
              type="button"
              onClick={() => handleStepChange(2)}
              className={`font-body-md text-body-md transition-colors duration-200 cursor-pointer ${
                currentStep === 2
                  ? 'text-primary font-bold border-b-2 border-primary pb-1'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Profile Setup
            </button>
            <button
              type="button"
              onClick={() => handleStepChange(3)}
              className={`font-body-md text-body-md transition-colors duration-200 cursor-pointer ${
                currentStep === 3
                  ? 'text-primary font-bold border-b-2 border-primary pb-1'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Review
            </button>
          </nav>
          <div className="flex items-center">
            <button type="button" className="p-2 text-gray-400 hover:text-primary transition-colors cursor-pointer">
              <span className="material-symbols-outlined">help</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Wizard Content Area */}
      <main className="flex-grow pt-28 pb-16 px-4 flex flex-col items-center justify-center">
        {/* Step Progress bar */}
        {currentStep <= 2 && (
          <div className="w-full max-w-[480px] mb-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-2">
              <span className="font-label-caps text-label-caps text-primary uppercase tracking-wider text-xs font-semibold">
                {progress.text}
              </span>
              <span className="font-label-caps text-label-caps text-gray-400 text-xs">
                {progress.percentage} Complete
              </span>
            </div>
            <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
              <div
                className={`h-full bg-primary-container rounded-full transition-all duration-700 ease-out active-step-glow ${progress.widthClass}`}
              ></div>
            </div>
          </div>
        )}

        {/* Active Step Form Component */}
        {renderActiveStep()}
      </main>

      {/* Footer */}
      <footer className="w-full py-6 px-4 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-border bg-surface-lowest z-10">
        <div className="font-headline-md text-headline-md font-bold text-primary text-lg">
          JobFinder AI
        </div>
        <div className="flex gap-6">
          <a className="font-label-sm text-label-sm text-gray-400 hover:text-text-primary transition-colors text-xs" href="#">
            Privacy Policy
          </a>
          <a className="font-label-sm text-label-sm text-gray-400 hover:text-text-primary transition-colors text-xs" href="#">
            Terms of Service
          </a>
          <a className="font-label-sm text-label-sm text-gray-400 hover:text-text-primary transition-colors text-xs" href="#">
            Help Center
          </a>
        </div>
        <div className="font-label-sm text-label-sm text-gray-400 text-xs">
          © 2026 JobFinder AI. All rights reserved.
        </div>
      </footer>
    </div>
  );
};
