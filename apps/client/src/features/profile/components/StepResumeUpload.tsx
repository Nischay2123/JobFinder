import React from 'react';
import { useDispatch } from 'react-redux';
import { useResumeUpload } from '../hooks/useResumeUpload';
import { setProfileSetupMode } from '../store/profileSlice';

export const StepResumeUpload: React.FC = () => {
  const dispatch = useDispatch();
  const {
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
  } = useResumeUpload();

  if (isLoading) {
    return (
      <div className="w-full max-w-xl glass-card rounded-xl p-8 md:p-10 flex flex-col items-center justify-center min-h-[350px] text-center">
        {/* Animated AI Glow Loader */}
        <div className="relative w-24 h-24 mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-primary-container/20"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-primary border-r-primary animate-spin"></div>
          <div className="absolute inset-2 bg-gradient-to-tr from-[#5E6AD2] to-[#DFD1FF] rounded-full opacity-60 blur-sm animate-pulse"></div>
        </div>
        <h3 className="font-headline-sm text-headline-sm text-white mb-2 font-semibold text-xl">
          AI Auto-Extracting Resume
        </h3>
        <p className="font-body-md text-body-md text-gray-400 max-w-sm">
          Gemini is analyzing your skills, work history, and projects. This will take just a few seconds...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-container-max px-4">
      {/* Banner for Preserved State */}
      {hasParsedData && (
        <div className="mb-6 p-4 glass-card border-primary/30 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 max-w-5xl mx-auto w-full animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-3 text-left">
            <span className="material-symbols-outlined text-primary text-2xl">info</span>
            <div>
              <p className="text-sm font-semibold text-white">Extracted resume details found</p>
              <p className="text-xs text-gray-400">You previously parsed a resume. Your details are preserved.</p>
            </div>
          </div>
          <button
            onClick={() => dispatch(setProfileSetupMode('edit'))}
            type="button"
            className="px-5 py-2.5 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 rounded-lg text-xs font-semibold cursor-pointer transition-all text-white"
          >
            CONTINUE WITH EXTRACTED DETAILS
          </button>
        </div>
      )}

      {/* Header Content */}
      <header className="text-center mb-10">
        <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-white mb-2 font-bold">
          Your Resume
        </h1>
        <p className="font-body-lg text-body-lg text-gray-300 max-w-xl mx-auto">
          Upload your existing resume for AI extraction or enter details manually.
        </p>
      </header>

      {/* Main Layout: Split View */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {/* Column A: Upload Zone */}
        <div
          className={`glass-card rounded-xl p-6 flex flex-col h-full group border transition-all ${
            dragActive ? 'border-primary bg-primary-container/5' : 'border-outline-variant'
          }`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          <div className="upload-zone rounded-lg flex-grow flex flex-col items-center justify-center p-6 min-h-[300px] text-center border-dashed border-2">
            <div className="mb-4 bg-primary-container/10 p-4 rounded-full group-hover:scale-110 transition-transform duration-300">
              <span className="material-symbols-outlined text-[48px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                cloud_upload
              </span>
            </div>
            <h3 className="font-headline-sm text-headline-sm text-white mb-2 font-semibold text-lg">
              Drop your resume here
            </h3>
            <p className="font-body-md text-body-md text-gray-400 mb-6">
              PDF only (up to 10MB)
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleChange}
              className="hidden"
            />
            <button
              onClick={onButtonClick}
              type="button"
              className="primary-btn px-6 py-3 rounded-lg font-label-caps text-label-caps text-white flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all font-semibold cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
              AI AUTO-EXTRACT RESUME
            </button>
          </div>

          {errorMsg && (
            <div className="mt-4 p-4 bg-red-950/20 border border-red-500/30 rounded-lg text-center space-y-4">
              <p className="text-red-500 text-sm font-semibold">{errorMsg}</p>
              <div className="flex gap-4 justify-center">
                <button
                  type="button"
                  onClick={() => setErrorMsg(null)}
                  className="px-4 py-2 bg-surface-container hover:bg-surface-container-high border border-outline-variant text-white text-xs font-semibold rounded-lg cursor-pointer transition-all"
                >
                  Retry Upload
                </button>
                <button
                  type="button"
                  onClick={handleManualPath}
                  className="px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 text-xs font-semibold rounded-lg cursor-pointer transition-all"
                >
                  Fill Details Manually
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Column B: Manual Entry */}
        <div className="glass-card rounded-xl p-6 flex flex-col justify-between h-full bg-surface-container-low/40">
          <div className="pt-6">
            <div className="w-16 h-16 bg-surface-container-high rounded-xl flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-[32px] text-secondary">edit_note</span>
            </div>
            <h3 className="font-headline-sm text-headline-sm text-white mb-3 font-semibold text-lg">
              Don't have a resume ready?
            </h3>
            <p className="font-body-md text-body-md text-gray-400 mb-6 leading-relaxed">
              No problem. You can build your professional profile from scratch. Our AI assistant will help you craft compelling descriptions for your roles as you go.
            </p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-2 text-gray-300 font-body-md">
                <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                Step-by-step career builder
              </li>
              <li className="flex items-center gap-2 text-gray-300 font-body-md">
                <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                Optimized for technical roles
              </li>
              <li className="flex items-center gap-2 text-gray-300 font-body-md">
                <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                Export as PDF later
              </li>
            </ul>
          </div>
          <button
            onClick={handleManualPath}
            type="button"
            className="secondary-btn w-full py-4 rounded-lg font-label-caps text-label-caps text-white flex items-center justify-center gap-2 transition-all active:scale-95 border border-outline-variant hover:bg-surface-container-high cursor-pointer"
          >
            FILL DETAILS MANUALLY
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      </div>

      {/* Back button to Step 1 */}
      <div className="flex justify-center mt-8">
        <button
          onClick={handleBackToStep1}
          className="text-gray-400 hover:text-primary transition-colors flex items-center gap-1 text-sm font-semibold cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          Back to Basic Info
        </button>
      </div>
    </div>
  );
};
export default StepResumeUpload;
