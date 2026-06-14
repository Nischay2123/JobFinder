import React from 'react';
import { useReviewSubmit } from '../hooks/useReviewSubmit';
import { ReviewGeneralInfo } from './Step3Review/ReviewGeneralInfo';
import { ReviewPreferences } from './Step3Review/ReviewPreferences';
import { ReviewLinks } from './Step3Review/ReviewLinks';
import { ReviewExperiences } from './Step3Review/ReviewExperiences';
import { ReviewProjects } from './Step3Review/ReviewProjects';

export const StepReviewSubmit: React.FC = () => {
  const {
    draft,
    isLoading,
    errorMsg,
    handleEditSection,
    handleSubmitProfile,
  } = useReviewSubmit();

  return (
    <div className="w-full max-w-4xl space-y-8 animate-in fade-in duration-500">
      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left Column: General & Preferences */}
        <div className="md:col-span-4 flex flex-col gap-6">
          <ReviewGeneralInfo 
            draft={draft} 
            onEdit={() => handleEditSection(1)} 
          />
          <ReviewPreferences 
            preferredRoles={draft.preferredRoles} 
            preferredLocations={draft.preferredLocations} 
            skills={draft.skills} 
            onEdit={() => handleEditSection(2)} 
          />
          <ReviewLinks 
            linkedinUrl={draft.linkedinUrl} 
            githubUrl={draft.githubUrl} 
            portfolioUrl={draft.portfolioUrl} 
            onEdit={() => handleEditSection(2)} 
          />
        </div>

        {/* Right Column: Experience & Projects */}
        <div className="md:col-span-8 flex flex-col gap-6">
          <ReviewExperiences 
            experiences={draft.experiences} 
            onEdit={() => handleEditSection(2)} 
          />
          <ReviewProjects 
            projects={draft.projects} 
            onEdit={() => handleEditSection(2)} 
          />
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-950/20 border border-red-500/30 rounded-lg text-red-500 text-sm text-center">
          {errorMsg}
        </div>
      )}

      {/* Submission Section with Back Navigation */}
      <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-4 text-center">
        <button
          onClick={() => handleEditSection(2)}
          type="button"
          className="px-8 py-4 rounded-xl border border-outline-variant text-white hover:bg-surface-container-high transition-colors font-semibold cursor-pointer w-full md:w-auto text-sm"
        >
          Back to Profile Setup
        </button>
        <button
          onClick={handleSubmitProfile}
          disabled={isLoading}
          type="button"
          className="glow-button px-12 py-4 rounded-xl font-headline-sm text-headline-sm text-white flex items-center gap-3 transition-all hover:px-14 active:scale-95 group font-bold cursor-pointer disabled:opacity-50 w-full md:w-auto"
        >
          {isLoading ? 'Saving Profile...' : 'Complete Onboarding'}
          <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">
            arrow_forward
          </span>
        </button>
      </div>
      <div className="text-center">
        <p className="text-xs text-gray-400 mt-2">
          By clicking complete, you agree to our{' '}
          <a className="text-primary hover:underline" href="#">
            Terms of Service
          </a>
          .
        </p>
      </div>
    </div>
  );
};
export default StepReviewSubmit;
