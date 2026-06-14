import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';

interface LocationInput {
  city: string;
  state: string;
  country: string;
}

export const JobPreferencesSection: React.FC = () => {
  const { register, setValue, watch, formState: { errors } } = useFormContext();

  const [roleInput, setRoleInput] = useState('');
  const [locationInput, setLocationInput] = useState('');
  const [skillInput, setSkillInput] = useState('');

  const watchedRoles: string[] = watch('preferredRoles') || [];
  const watchedLocations: LocationInput[] = watch('preferredLocations') || [];
  const watchedSkills: string[] = watch('skills') || [];

  const addRole = () => {
    if (roleInput.trim() && !watchedRoles.includes(roleInput.trim())) {
      setValue('preferredRoles', [...watchedRoles, roleInput.trim()], { shouldValidate: true });
      setRoleInput('');
    }
  };

  const removeRole = (index: number) => {
    setValue('preferredRoles', watchedRoles.filter((_, i) => i !== index), { shouldValidate: true });
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
    setValue('preferredLocations', watchedLocations.filter((_, i) => i !== index));
  };

  const addSkill = () => {
    if (skillInput.trim() && !watchedSkills.includes(skillInput.trim())) {
      setValue('skills', [...watchedSkills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const removeSkill = (index: number) => {
    setValue('skills', watchedSkills.filter((_, i) => i !== index));
  };

  return (
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
            <span className="text-xs text-red-500 block mt-1 ml-1">{errors.preferredRoles.message as string}</span>
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
  );
};
