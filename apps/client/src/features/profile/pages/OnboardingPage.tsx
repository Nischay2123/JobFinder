import * as React from 'react';
import { useOnboardingPage } from '../hooks/useOnboardingPage';
import { StepBasicInfo } from '../components/StepBasicInfo';
import { StepResumeUpload } from '../components/StepResumeUpload';
import { StepManualForm } from '../components/StepManualForm';
import { StepReviewSubmit } from '../components/StepReviewSubmit';
import { Navbar } from '@shared/components/Navbar';
import { Logo } from '@shared/components/Logo';
import { Footer } from '@shared/components/Footer';

export const OnboardingPage: React.FC = () => {
  const {
    currentStep,
    profileSetupMode,
    toastMessage,
    progress,
    stepSubmitRef,
    triggerToast,
    handleStepChange,
  } = useOnboardingPage()

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
      <Navbar
        isFixed={true}
        left={<Logo variant="onboarding" />}
        center={
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
        }
        right={
          <div className="flex items-center">
            <button type="button" className="p-2 text-gray-400 hover:text-primary transition-colors cursor-pointer">
              <span className="material-symbols-outlined">help</span>
            </button>
          </div>
        }
      />

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
      <Footer variant="onboarding" />
    </div>
  );
};

export default OnboardingPage;
