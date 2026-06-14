import React from 'react';
import { useFormContext } from 'react-hook-form';

interface ExperienceItemFormProps {
  index: number;
  onRemove: () => void;
  isCurrentRole: boolean;
}

export const ExperienceItemForm: React.FC<ExperienceItemFormProps> = ({
  index,
  onRemove,
  isCurrentRole,
}) => {
  const { register, formState: { errors } } = useFormContext();
  const experienceErrors = (errors.experiences as any)?.[index];

  return (
    <div className="p-5 border border-outline-variant/50 rounded-xl bg-surface-dim relative group overflow-hidden">
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={onRemove}
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
            {...register(`experiences.${index}.companyName` as const, { required: 'Company name is required' })}
            className={`w-full bg-surface-container-lowest border rounded-lg px-3 py-2 text-body-md text-white focus:outline-none focus:border-primary-container focus:ring-4 focus:ring-primary-container/20 transition-all outline-none ${
              experienceErrors?.companyName ? 'border-red-500' : 'border-outline-variant'
            }`}
          />
          {experienceErrors?.companyName && (
            <span className="text-xs text-red-500 block mt-1 ml-1">{experienceErrors.companyName?.message}</span>
          )}
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">Role<span className="text-red-500 ml-0.5">*</span></label>
          <input
            type="text"
            placeholder="e.g. Lead Developer"
            {...register(`experiences.${index}.role` as const, { required: 'Role is required' })}
            className={`w-full bg-surface-container-lowest border rounded-lg px-3 py-2 text-body-md text-white focus:outline-none focus:border-primary-container focus:ring-4 focus:ring-primary-container/20 transition-all outline-none ${
              experienceErrors?.role ? 'border-red-500' : 'border-outline-variant'
            }`}
          />
          {experienceErrors?.role && (
            <span className="text-xs text-red-500 block mt-1 ml-1">{experienceErrors.role?.message}</span>
          )}
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">Type</label>
          <select
            {...register(`experiences.${index}.employmentType` as const)}
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
              {...register(`experiences.${index}.startDate` as const, { required: 'Start date is required' })}
              className={`w-full bg-surface-container-lowest border rounded-lg px-3 py-2 text-body-md text-white focus:outline-none focus:border-primary-container focus:ring-4 focus:ring-primary-container/20 transition-all outline-none cursor-pointer ${
                experienceErrors?.startDate ? 'border-red-500' : 'border-outline-variant'
              }`}
            />
            {experienceErrors?.startDate && (
              <span className="text-xs text-red-500 block mt-1 ml-1">{experienceErrors.startDate?.message}</span>
            )}
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">End Date</label>
            <input
              type="month"
              disabled={isCurrentRole}
              {...register(`experiences.${index}.endDate` as const)}
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 text-body-md text-white focus:outline-none focus:border-primary-container focus:ring-4 focus:ring-primary-container/20 transition-all outline-none disabled:opacity-40 cursor-pointer"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <input
          id={`current-work-${index}`}
          type="checkbox"
          {...register(`experiences.${index}.isCurrent` as const)}
          className="w-4 h-4 rounded border-outline-variant bg-surface-container-lowest text-primary focus:ring-primary/20 cursor-pointer"
        />
        <label className="text-body-md text-gray-300 cursor-pointer select-none font-medium" htmlFor={`current-work-${index}`}>
          I am currently working in this role
        </label>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-300 mb-1">Description</label>
        <textarea
          placeholder="Describe your key responsibilities and achievements..."
          rows={4}
          {...register(`experiences.${index}.description` as const)}
          className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 text-body-md text-white focus:outline-none focus:border-primary-container focus:ring-4 focus:ring-primary-container/20 transition-all outline-none custom-scrollbar"
        />
      </div>
    </div>
  );
};
