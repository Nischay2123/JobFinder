import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../../app/store';
import { useSaveOnboardingMutation } from '../api/profileApi';
import { setStep, resetOnboardingState } from '../store/profileSlice';
import { setCredentials } from '@features/auth';

export const StepReviewSubmit: React.FC = () => {
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

    // Prepare payload matching SaveOnboardingInput
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

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'STUDENT':
        return 'Student';
      case 'FRESHER':
        return 'Fresher';
      case 'WORKING_PROFESSIONAL':
        return 'Working Professional';
      default:
        return status;
    }
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  return (
    <div className="w-full max-w-4xl space-y-8 animate-in fade-in duration-500">
      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left Column: General & Preferences */}
        <div className="md:col-span-4 flex flex-col gap-6">
          {/* General Info Card */}
          <section className="glass-card rounded-xl p-6 top-light relative">
            <div className="flex justify-between items-center mb-4 border-b border-outline-variant/30 pb-2">
              <h3 className="font-headline-sm text-headline-sm flex items-center gap-2 font-bold text-white text-lg">
                <span className="material-symbols-outlined text-primary">person</span>
                General Info
              </h3>
              <button
                type="button"
                onClick={() => handleEditSection(1)}
                className="material-symbols-outlined text-gray-400 text-lg hover:text-primary transition-colors cursor-pointer"
              >
                edit
              </button>
            </div>
            <div className="space-y-4 text-sm">
              <div>
                <p className="font-label-md text-label-md text-gray-400 font-semibold">Full Name</p>
                <p className="font-body-lg text-body-lg text-white">
                  {draft.firstName} {draft.lastName}
                </p>
              </div>
              <div>
                <p className="font-label-md text-label-md text-gray-400 font-semibold">Phone Number</p>
                <p className="font-body-lg text-body-lg text-white">{draft.phone}</p>
              </div>
              <div>
                <p className="font-label-md text-label-md text-gray-400 font-semibold">Current Status</p>
                <p className="font-body-lg text-body-lg text-white">{getStatusLabel(draft.currentStatus)}</p>
              </div>
              {draft.experienceYears !== null && (
                <div>
                  <p className="font-label-md text-label-md text-gray-400 font-semibold">Years of Experience</p>
                  <p className="font-body-lg text-body-lg text-white">{draft.experienceYears} years</p>
                </div>
              )}
            </div>
          </section>

          {/* Preferences & Skills Card */}
          <section className="glass-card rounded-xl p-6 top-light">
            <div className="flex justify-between items-center mb-4 border-b border-outline-variant/30 pb-2">
              <h3 className="font-headline-sm text-headline-sm flex items-center gap-2 font-bold text-white text-lg">
                <span className="material-symbols-outlined text-primary">settings_suggest</span>
                Preferences
              </h3>
              <button
                type="button"
                onClick={() => handleEditSection(2)}
                className="material-symbols-outlined text-gray-400 text-lg hover:text-primary transition-colors cursor-pointer"
              >
                edit
              </button>
            </div>
            <div className="space-y-4 text-sm">
              <div>
                <p className="font-label-md text-label-md text-gray-400 mb-2 font-semibold">Preferred Roles</p>
                <div className="flex flex-wrap gap-1.5">
                  {draft.preferredRoles.map((role: string, i: number) => (
                    <span key={i} className="px-2.5 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-semibold">
                      {role}
                    </span>
                  ))}
                  {draft.preferredRoles.length === 0 && <span className="text-xs text-gray-400">-</span>}
                </div>
              </div>
              <div>
                <p className="font-label-md text-label-md text-gray-400 mb-2 font-semibold">Preferred Locations</p>
                <div className="flex flex-wrap gap-1.5">
                  {draft.preferredLocations.map((loc: any, i: number) => (
                    <span key={i} className="px-2.5 py-0.5 bg-tertiary-container/10 text-tertiary border border-tertiary/20 rounded-full text-xs font-semibold">
                      {loc.city}
                      {loc.state ? `, ${loc.state}` : ''}
                    </span>
                  ))}
                  {draft.preferredLocations.length === 0 && <span className="text-xs text-gray-400">-</span>}
                </div>
              </div>
              <div>
                <p className="font-label-md text-label-md text-gray-400 mb-2 font-semibold">Core Skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {draft.skills.map((skill: string, i: number) => (
                    <span key={i} className="px-2.5 py-0.5 bg-secondary-container/20 text-secondary border border-secondary/30 rounded-full text-xs font-semibold">
                      {skill}
                    </span>
                  ))}
                  {draft.skills.length === 0 && <span className="text-xs text-gray-400">-</span>}
                </div>
              </div>
            </div>
          </section>

          {/* Links Card */}
          <section className="glass-card rounded-xl p-6 top-light">
            <div className="flex justify-between items-center mb-4 border-b border-outline-variant/30 pb-2">
              <h3 className="font-headline-sm text-headline-sm flex items-center gap-2 font-bold text-white text-lg">
                <span className="material-symbols-outlined text-primary">link</span>
                Links
              </h3>
              <button
                type="button"
                onClick={() => handleEditSection(2)}
                className="material-symbols-outlined text-gray-400 text-lg hover:text-primary transition-colors cursor-pointer"
              >
                edit
              </button>
            </div>
            <div className="space-y-3 text-sm">
              {draft.linkedinUrl && (
                <div className="flex items-center gap-2 text-white font-medium">
                  <span className="material-symbols-outlined text-base text-primary">public</span>
                  <a href={draft.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-white hover:text-primary hover:underline truncate">
                    LinkedIn
                  </a>
                </div>
              )}
              {draft.githubUrl && (
                <div className="flex items-center gap-2 text-white font-medium">
                  <span className="material-symbols-outlined text-base text-primary font-bold">code</span>
                  <a href={draft.githubUrl} target="_blank" rel="noopener noreferrer" className="text-white hover:text-primary hover:underline truncate">
                    GitHub
                  </a>
                </div>
              )}
              {draft.portfolioUrl && (
                <div className="flex items-center gap-2 text-white font-medium">
                  <span className="material-symbols-outlined text-base text-primary">portrait</span>
                  <a href={draft.portfolioUrl} target="_blank" rel="noopener noreferrer" className="text-white hover:text-primary hover:underline truncate">
                    Portfolio
                  </a>
                </div>
              )}
              {!draft.linkedinUrl && !draft.githubUrl && !draft.portfolioUrl && (
                <p className="text-xs text-gray-400">No links provided</p>
              )}
            </div>
          </section>
        </div>

        {/* Right Column: Experience & Projects */}
        <div className="md:col-span-8 flex flex-col gap-6">
          {/* Experiences Card */}
          <section className="glass-card rounded-xl p-6 top-light">
            <div className="flex justify-between items-center mb-6 border-b border-outline-variant/30 pb-2">
              <h3 className="font-headline-sm text-headline-sm flex items-center gap-2 font-bold text-white text-lg">
                <span className="material-symbols-outlined text-primary">work</span>
                Experiences
              </h3>
              <button
                type="button"
                onClick={() => handleEditSection(2)}
                className="material-symbols-outlined text-gray-400 text-lg hover:text-primary transition-colors cursor-pointer"
              >
                edit
              </button>
            </div>
            <div className="space-y-6">
              {draft.experiences.map((exp: any, idx: number) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h4 className="font-body-lg text-body-lg font-bold text-white">{exp.companyName}</h4>
                      <p className="text-primary text-sm font-semibold">{exp.role} ({exp.employmentType || 'Full-time'})</p>
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      {formatDate(exp.startDate)} — {exp.isCurrent ? 'Present' : formatDate(exp.endDate)}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="text-gray-300 text-sm leading-relaxed mt-2 whitespace-pre-wrap">
                      {exp.description}
                    </p>
                  )}
                  {idx < draft.experiences.length - 1 && <div className="border-t border-outline-variant/30 mt-4"></div>}
                </div>
              ))}

              {draft.experiences.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4">
                  No work experience provided.
                </p>
              )}
            </div>
          </section>

          {/* Projects Card */}
          <section className="glass-card rounded-xl p-6 top-light">
            <div className="flex justify-between items-center mb-6 border-b border-outline-variant/30 pb-2">
              <h3 className="font-headline-sm text-headline-sm flex items-center gap-2 font-bold text-white text-lg">
                <span className="material-symbols-outlined text-primary">rocket_launch</span>
                Projects
              </h3>
              <button
                type="button"
                onClick={() => handleEditSection(2)}
                className="material-symbols-outlined text-gray-400 text-lg hover:text-primary transition-colors cursor-pointer"
              >
                edit
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {draft.projects.map((proj: any, idx: number) => (
                <div key={idx} className="bg-surface-container-low rounded-lg p-4 border border-outline-variant/50 flex flex-col justify-between min-h-[160px]">
                  <div>
                    <h5 className="font-body-md text-body-md font-bold text-white mb-1">{proj.title}</h5>
                    {proj.description && (
                      <p className="text-xs text-gray-300 mb-3 line-clamp-2 leading-relaxed">
                        {proj.description}
                      </p>
                    )}
                  </div>
                  <div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {(proj.technologies || []).map((tech: string, tIdx: number) => (
                        <span key={tIdx} className="px-1.5 py-0.5 bg-surface-container-high rounded text-[10px] text-white border border-outline-variant/30 font-semibold">
                          {tech}
                        </span>
                      ))}
                    </div>
                    
                    {/* Render split links (GitHub and Live Demo) */}
                    <div className="flex gap-4 mt-auto">
                      {proj.githubUrl && (
                        <a
                          href={proj.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline flex items-center gap-1 font-semibold"
                        >
                          <span className="material-symbols-outlined text-[14px]">code</span>
                          GitHub
                        </a>
                      )}
                      {proj.liveUrl && (
                        <a
                          href={proj.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-tertiary hover:underline flex items-center gap-1 font-semibold"
                        >
                          <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                          Live Demo
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {draft.projects.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4 col-span-2">
                  No personal projects provided.
                </p>
              )}
            </div>
          </section>
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
