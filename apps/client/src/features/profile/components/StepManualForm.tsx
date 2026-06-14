import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
import { updateDraft, setStep, setProfileSetupMode } from '../store/profileSlice';

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

interface ManualFormInputs {
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

  // Local inputs for chip tags
  const [roleInput, setRoleInput] = useState('');
  const [locationInput, setLocationInput] = useState('');
  const [skillInput, setSkillInput] = useState('');

  // Project-level technology tag inputs
  const [projectTechInputs, setProjectTechInputs] = useState<{ [key: number]: string }>({});

  const { register, control, handleSubmit, setValue, watch, trigger, getValues, setError, clearErrors, formState: { errors } } = useForm<ManualFormInputs>({
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

  const {
    fields: expFields,
    append: appendExp,
    remove: removeExp,
  } = useFieldArray({
    control,
    name: 'experiences',
  });

  const {
    fields: projFields,
    append: appendProj,
    remove: removeProj,
  } = useFieldArray({
    control,
    name: 'projects',
  });

  const watchedRoles = watch('preferredRoles');
  const watchedLocations = watch('preferredLocations');
  const watchedSkills = watch('skills');
  const watchedExperiences = watch('experiences');

  // Tag Add Handlers
  const addRole = () => {
    if (roleInput.trim() && !watchedRoles.includes(roleInput.trim())) {
      setValue('preferredRoles', [...watchedRoles, roleInput.trim()]);
      setRoleInput('');
    }
  };

  const removeRole = (index: number) => {
    setValue(
      'preferredRoles',
      watchedRoles.filter((_, i) => i !== index)
    );
  };

  const parseLocationString = (input: string): LocationInput => {
    const parts = input.split(',').map((p) => p.trim());
    if (parts.length >= 3) {
      return { city: parts[0], state: parts[1], country: parts[2] };
    } else if (parts.length === 2) {
      return { city: parts[0], state: '', country: parts[1] };
    } else {
      return { city: parts[0], state: '', country: 'India' };
    }
  };

  const addLocation = () => {
    if (locationInput.trim()) {
      const parsed = parseLocationString(locationInput.trim());
      // Check duplicate
      const exists = watchedLocations.some(
        (loc) => loc.city.toLowerCase() === parsed.city.toLowerCase()
      );
      if (!exists) {
        setValue('preferredLocations', [...watchedLocations, parsed]);
      }
      setLocationInput('');
    }
  };

  const removeLocation = (index: number) => {
    setValue(
      'preferredLocations',
      watchedLocations.filter((_, i) => i !== index)
    );
  };

  const addSkill = () => {
    if (skillInput.trim() && !watchedSkills.includes(skillInput.trim())) {
      setValue('skills', [...watchedSkills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const removeSkill = (index: number) => {
    setValue(
      'skills',
      watchedSkills.filter((_, i) => i !== index)
    );
  };

  // Project Technology Tag Handlers
  const addProjTech = (projIndex: number) => {
    const tech = projectTechInputs[projIndex]?.trim();
    if (tech) {
      const currentProjs = watch('projects');
      const currentTechs = currentProjs[projIndex].technologies || [];
      if (!currentTechs.includes(tech)) {
        const updatedTechs = [...currentTechs, tech];
        setValue(`projects.${projIndex}.technologies`, updatedTechs);
      }
      setProjectTechInputs({
        ...projectTechInputs,
        [projIndex]: '',
      });
    }
  };

  const removeProjTech = (projIndex: number, techIndex: number) => {
    const currentProjs = watch('projects');
    const currentTechs = currentProjs[projIndex].technologies || [];
    setValue(
      `projects.${projIndex}.technologies`,
      currentTechs.filter((_, i) => i !== techIndex)
    );
  };

  // Expose validation function to parent ref
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

    // Save details to redux
    dispatch(
      updateDraft({
        preferredRoles: data.preferredRoles,
        preferredLocations: data.preferredLocations,
        skills: data.skills,
        linkedinUrl: data.linkedinUrl,
        githubUrl: data.githubUrl,
        portfolioUrl: data.portfolioUrl,
        experienceYears: data.experienceYears,
        // Convert year-month back to Date strings or full ISO Date representation
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

  const onError = () => {
    triggerToast('Please fill in all required fields marked with *');
  };

  return (
    <div className="w-full max-w-3xl glass-card rounded-xl p-6 md:p-10 top-light">
      <div className="mb-8">
        <h1 className="font-display-lg text-display-lg text-white mb-2 font-bold text-3xl">
          Professional Profile
        </h1>
        <p className="font-body-md text-body-md text-gray-300">
          Tell us more about your career history and aspirations to find your perfect fit.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-10">
        {/* SECTION 1: Preferences */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 mb-4 border-b border-outline-variant/30 pb-2">
            <span className="material-symbols-outlined text-primary">target</span>
            <h2 className="font-headline-sm text-headline-sm font-semibold text-lg text-white">Job Preferences</h2>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* Preferred Roles */}
            <div>
              <label className="block text-label-md font-label-md text-gray-300 mb-2 font-medium">
                Preferred Roles<span className="text-red-500 ml-0.5">*</span>
              </label>
              <div className={`flex flex-wrap gap-2 p-3 bg-surface-container-lowest border rounded-lg min-h-[48px] focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/20 transition-all ${
                errors.preferredRoles ? 'border-red-500' : 'border-outline-variant'
              }`}>
                {watchedRoles.map((role, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-primary-container/10 text-primary border border-primary/20 rounded-full text-label-md flex items-center gap-1 text-xs font-semibold"
                  >
                    {role}
                    <button
                      type="button"
                      onClick={() => removeRole(idx)}
                      className="material-symbols-outlined text-[14px] cursor-pointer hover:text-white"
                    >
                      close
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  placeholder="Type role and click Add..."
                  value={roleInput}
                  onChange={(e) => setRoleInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addRole();
                    }
                  }}
                  className="bg-transparent border-none focus:outline-none focus:ring-0 text-body-md placeholder:text-outline p-0 flex-1 min-w-[150px] outline-none text-white"
                />
                <button
                  type="button"
                  onClick={addRole}
                  className="text-primary text-xs font-bold px-2 hover:underline cursor-pointer"
                >
                  + Add
                </button>
              </div>
              {errors.preferredRoles && (
                <span className="text-xs text-red-500 block mt-1 ml-1">{errors.preferredRoles.message}</span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Preferred Locations */}
              <div>
                <label className="block text-label-md font-label-md text-gray-300 mb-2 font-medium">
                  Preferred Locations
                </label>
                <div className="flex flex-wrap gap-2 p-3 bg-surface-container-lowest border border-outline-variant rounded-lg min-h-[48px] focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/20 transition-all">
                  {watchedLocations.map((loc, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-tertiary-container/10 text-tertiary border border-tertiary/20 rounded-full text-label-md flex items-center gap-1 text-xs font-semibold"
                    >
                      {loc.city}
                      {loc.state ? `, ${loc.state}` : ''}
                      {loc.country ? `, ${loc.country}` : ''}
                      <button
                        type="button"
                        onClick={() => removeLocation(idx)}
                        className="material-symbols-outlined text-[14px] cursor-pointer hover:text-white"
                      >
                        close
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    placeholder="City, State, Country..."
                    value={locationInput}
                    onChange={(e) => setLocationInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addLocation();
                      }
                    }}
                    className="bg-transparent border-none focus:outline-none focus:ring-0 text-body-md placeholder:text-outline p-0 flex-1 min-w-[120px] outline-none text-white"
                  />
                  <button
                    type="button"
                    onClick={addLocation}
                    className="text-primary text-xs font-bold px-2 hover:underline cursor-pointer"
                  >
                    + Add
                  </button>
                </div>
              </div>

              {/* Core Skills */}
              <div>
                <label className="block text-label-md font-label-md text-gray-300 mb-2 font-medium">
                  Core Skills
                </label>
                <div className="flex flex-wrap gap-2 p-3 bg-surface-container-lowest border border-outline-variant rounded-lg min-h-[48px] focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/20 transition-all">
                  {watchedSkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-secondary-container/20 text-secondary border border-secondary/30 rounded-full text-label-md flex items-center gap-1 text-xs font-semibold"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(idx)}
                        className="material-symbols-outlined text-[14px] cursor-pointer hover:text-white"
                      >
                        close
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    placeholder="Type skill and click Add..."
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addSkill();
                      }
                    }}
                    className="bg-transparent border-none focus:outline-none focus:ring-0 text-body-md placeholder:text-outline p-0 flex-1 min-w-[120px] outline-none text-white"
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="text-primary text-xs font-bold px-2 hover:underline cursor-pointer"
                  >
                    + Add
                  </button>
                </div>
              </div>
            </div>

            {/* Experience Years */}
            <div>
              <label className="block text-label-md font-label-md text-gray-300 mb-2 font-medium" htmlFor="experienceYears">
                Years of Experience
              </label>
              <input
                id="experienceYears"
                type="number"
                min="0"
                max="50"
                step="any"
                placeholder="e.g. 3"
                {...register('experienceYears', { valueAsNumber: true })}
                className="w-full md:w-1/2 bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3 text-white font-body-md focus:outline-none focus:border-primary-container focus:ring-4 focus:ring-primary-container/20 placeholder:text-outline-variant transition-all outline-none"
              />
            </div>
          </div>
        </section>

        {/* SECTION 2: Links */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 mb-4 border-b border-outline-variant/30 pb-2">
            <span className="material-symbols-outlined text-primary">link</span>
            <h2 className="font-headline-sm text-headline-sm font-semibold text-lg text-white">Professional Links</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative group">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 group-focus-within:text-primary transition-colors">
                public
              </span>
              <input
                type="url"
                placeholder="LinkedIn URL (https://...)"
                {...register('linkedinUrl')}
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg pl-10 pr-3 py-3 text-body-md text-white focus:outline-none focus:border-primary-container focus:ring-4 focus:ring-primary-container/20 transition-all outline-none"
              />
            </div>

            <div className="relative group">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 group-focus-within:text-primary transition-colors">
                code
              </span>
              <input
                type="url"
                placeholder="GitHub URL (https://...)"
                {...register('githubUrl')}
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg pl-10 pr-3 py-3 text-body-md text-white focus:outline-none focus:border-primary-container focus:ring-4 focus:ring-primary-container/20 transition-all outline-none"
              />
            </div>

            <div className="md:col-span-2 relative group">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 group-focus-within:text-primary transition-colors">
                portrait
              </span>
              <input
                type="url"
                placeholder="Portfolio URL (https://...)"
                {...register('portfolioUrl')}
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg pl-10 pr-3 py-3 text-body-md text-white focus:outline-none focus:border-primary-container focus:ring-4 focus:ring-primary-container/20 transition-all outline-none"
              />
            </div>
          </div>
        </section>

        {/* SECTION 3: Work Experience */}
        <section className="space-y-6">
          <div className="flex justify-between items-center mb-4 border-b border-outline-variant/30 pb-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">work</span>
              <h2 className="font-headline-sm text-headline-sm font-semibold text-lg text-white">Work Experience</h2>
            </div>
            <button
              onClick={() =>
                appendExp({
                  companyName: '',
                  role: '',
                  employmentType: 'Full-time',
                  startDate: '',
                  endDate: '',
                  isCurrent: false,
                  description: '',
                })
              }
              type="button"
              className="text-primary font-bold text-sm flex items-center gap-1 hover:opacity-80 transition-opacity cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">add</span> Add Work Experience
            </button>
          </div>

          <div className="space-y-6">
            {expFields.map((field, idx) => (
              <div
                key={field.id}
                className="p-5 border border-outline-variant/50 rounded-xl bg-surface-dim relative group overflow-hidden"
              >
                 <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => removeExp(idx)}
                    type="button"
                    className="text-red-500 material-symbols-outlined hover:bg-red-500/10 p-1 rounded-md cursor-pointer"
                  >
                    delete
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Company<span className="text-red-500 ml-0.5">*</span></label>
                    <input
                      type="text"
                      placeholder="e.g. Acme Corp"
                      {...register(`experiences.${idx}.companyName` as const, { required: 'Company name is required' })}
                      className={`w-full bg-surface-container-lowest border rounded-lg px-3 py-2 text-body-md text-white focus:outline-none focus:border-primary-container focus:ring-4 focus:ring-primary-container/20 transition-all outline-none ${
                        errors.experiences?.[idx]?.companyName ? 'border-red-500' : 'border-outline-variant'
                      }`}
                    />
                    {errors.experiences?.[idx]?.companyName && (
                      <span className="text-xs text-red-500 block mt-1 ml-1">{errors.experiences[idx]?.companyName?.message}</span>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Role<span className="text-red-500 ml-0.5">*</span></label>
                    <input
                      type="text"
                      placeholder="e.g. Lead Developer"
                      {...register(`experiences.${idx}.role` as const, { required: 'Role is required' })}
                      className={`w-full bg-surface-container-lowest border rounded-lg px-3 py-2 text-body-md text-white focus:outline-none focus:border-primary-container focus:ring-4 focus:ring-primary-container/20 transition-all outline-none ${
                        errors.experiences?.[idx]?.role ? 'border-red-500' : 'border-outline-variant'
                      }`}
                    />
                    {errors.experiences?.[idx]?.role && (
                      <span className="text-xs text-red-500 block mt-1 ml-1">{errors.experiences[idx]?.role?.message}</span>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Type</label>
                    <select
                      {...register(`experiences.${idx}.employmentType` as const)}
                      className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 text-body-md text-white focus:outline-none focus:border-primary-container focus:ring-4 focus:ring-primary-container/20 transition-all outline-none cursor-pointer"
                    >
                      <option value="Full-time" className="bg-surface-mid text-white">Full-time</option>
                      <option value="Contract" className="bg-surface-mid text-white">Contract</option>
                      <option value="Freelance" className="bg-surface-mid text-white">Freelance</option>
                      <option value="Internship" className="bg-surface-mid text-white">Internship</option>
                      <option value="Part-time" className="bg-surface-mid text-white">Part-time</option>
                      <option value="Trainee" className="bg-surface-mid text-white">Trainee</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1">Start Date<span className="text-red-500 ml-0.5">*</span></label>
                      <input
                        type="month"
                        {...register(`experiences.${idx}.startDate` as const, { required: 'Start date is required' })}
                        className={`w-full bg-surface-container-lowest border rounded-lg px-3 py-2 text-body-md text-white focus:outline-none focus:border-primary-container focus:ring-4 focus:ring-primary-container/20 transition-all outline-none cursor-pointer ${
                          errors.experiences?.[idx]?.startDate ? 'border-red-500' : 'border-outline-variant'
                        }`}
                      />
                      {errors.experiences?.[idx]?.startDate && (
                        <span className="text-xs text-red-500 block mt-1 ml-1">{errors.experiences[idx]?.startDate?.message}</span>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1">End Date</label>
                      <input
                        type="month"
                        disabled={watchedExperiences[idx]?.isCurrent}
                        {...register(`experiences.${idx}.endDate` as const)}
                        className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 text-body-md text-white focus:outline-none focus:border-primary-container focus:ring-4 focus:ring-primary-container/20 transition-all outline-none disabled:opacity-40 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <input
                    id={`current-work-${idx}`}
                    type="checkbox"
                    {...register(`experiences.${idx}.isCurrent` as const)}
                    className="w-4 h-4 rounded border-outline-variant bg-surface-container-lowest text-primary focus:ring-primary/20 cursor-pointer"
                  />
                  <label className="text-body-md text-gray-300 cursor-pointer select-none font-medium" htmlFor={`current-work-${idx}`}>
                    I am currently working in this role
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Description</label>
                  <textarea
                    placeholder="Describe your key responsibilities and achievements..."
                    rows={4}
                    {...register(`experiences.${idx}.description` as const)}
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 text-body-md text-white focus:outline-none focus:border-primary-container focus:ring-4 focus:ring-primary-container/20 transition-all outline-none custom-scrollbar"
                  />
                </div>
              </div>
            ))}

            {expFields.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">
                No work experience added yet. Click 'Add Work Experience' or proceed.
              </p>
            )}
          </div>
        </section>

        {/* SECTION 4: Projects */}
        <section className="space-y-6">
          <div className="flex justify-between items-center mb-4 border-b border-outline-variant/30 pb-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">rocket_launch</span>
              <h2 className="font-headline-sm text-headline-sm font-semibold text-lg text-white">Personal Projects</h2>
            </div>
            <button
              onClick={() =>
                appendProj({
                  title: '',
                  description: '',
                  technologies: [],
                  githubUrl: '',
                  liveUrl: '',
                })
              }
              type="button"
              className="text-primary font-bold text-sm flex items-center gap-1 hover:opacity-80 transition-opacity cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">add</span> Add Project
            </button>
          </div>

          <div className="space-y-6">
            {projFields.map((field, idx) => (
              <div
                key={field.id}
                className="p-5 border border-outline-variant/50 rounded-xl bg-surface-dim relative group overflow-hidden"
              >
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => removeProj(idx)}
                    type="button"
                    className="text-red-500 material-symbols-outlined hover:bg-red-500/10 p-1 rounded-md cursor-pointer"
                  >
                    delete
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Project Title<span className="text-red-500 ml-0.5">*</span></label>
                    <input
                      type="text"
                      placeholder="e.g. AI Portfolio Generator"
                      {...register(`projects.${idx}.title` as const, { required: 'Project title is required' })}
                      className={`w-full bg-surface-container-lowest border rounded-lg px-3 py-2 text-body-md text-white focus:outline-none focus:border-primary-container focus:ring-4 focus:ring-primary-container/20 transition-all outline-none ${
                        errors.projects?.[idx]?.title ? 'border-red-500' : 'border-outline-variant'
                      }`}
                    />
                    {errors.projects?.[idx]?.title && (
                      <span className="text-xs text-red-500 block mt-1 ml-1">{errors.projects[idx]?.title?.message}</span>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Description</label>
                    <textarea
                      placeholder="What did you build and why?"
                      rows={3}
                      {...register(`projects.${idx}.description` as const)}
                      className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 text-body-md text-white focus:outline-none focus:border-primary-container focus:ring-4 focus:ring-primary-container/20 transition-all outline-none custom-scrollbar"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {/* Project Technologies */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1">Technologies Used</label>
                      <div className="flex flex-wrap gap-2 p-2 bg-surface-container-lowest border border-outline-variant rounded-lg min-h-[42px] focus-within:border-primary transition-all">
                        {(watch(`projects.${idx}.technologies`) || []).map((t, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2 py-0.5 bg-secondary-container/20 text-secondary border border-secondary/30 rounded-full text-xs flex items-center gap-1 font-semibold"
                          >
                            {t}
                            <button
                              type="button"
                              onClick={() => removeProjTech(idx, tIdx)}
                              className="material-symbols-outlined text-[12px] cursor-pointer hover:text-white"
                            >
                              close
                            </button>
                          </span>
                        ))}
                        <input
                          type="text"
                          placeholder="Add tech..."
                          value={projectTechInputs[idx] || ''}
                          onChange={(e) =>
                            setProjectTechInputs({
                              ...projectTechInputs,
                              [idx]: e.target.value,
                            })
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addProjTech(idx);
                            }
                          }}
                          className="bg-transparent border-none focus:outline-none focus:ring-0 text-body-md placeholder:text-outline p-0 flex-1 min-w-[80px] outline-none text-white"
                        />
                        <button
                          type="button"
                          onClick={() => addProjTech(idx)}
                          className="text-primary text-xs font-bold px-1 hover:underline cursor-pointer"
                        >
                          + Add
                        </button>
                      </div>
                    </div>

                    {/* Double Project Links (GitHub and Live URL) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-1">GitHub Link</label>
                        <input
                          type="url"
                          placeholder="https://github.com/..."
                          {...register(`projects.${idx}.githubUrl` as const)}
                          className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 text-body-md text-white focus:outline-none focus:border-primary-container focus:ring-4 focus:ring-primary-container/20 transition-all outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-1">Live/Demo Link</label>
                        <input
                          type="url"
                          placeholder="https://..."
                          {...register(`projects.${idx}.liveUrl` as const)}
                          className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 text-body-md text-white focus:outline-none focus:border-primary-container focus:ring-4 focus:ring-primary-container/20 transition-all outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {projFields.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">
                No personal projects added yet. Click 'Add Project' or proceed.
              </p>
            )}
          </div>
        </section>

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
  );
};
