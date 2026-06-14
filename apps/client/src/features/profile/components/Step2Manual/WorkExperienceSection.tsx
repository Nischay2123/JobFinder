import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { ExperienceItemForm } from './ExperienceItemForm';

export const WorkExperienceSection: React.FC = () => {
  const { control, watch } = useFormContext();
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'experiences',
  });

  const watchedExperiences = watch('experiences') || [];

  return (
    <section className="space-y-6">
      <div className="flex justify-between items-center mb-4 border-b border-outline-variant/30 pb-2">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">work</span>
          <h2 className="font-headline-sm text-headline-sm font-semibold text-lg text-white">Work Experience</h2>
        </div>
        <button
          onClick={() =>
            append({
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
        {fields.map((field, idx) => (
          <ExperienceItemForm 
            key={field.id} 
            index={idx} 
            onRemove={() => remove(idx)} 
            isCurrentRole={!!watchedExperiences[idx]?.isCurrent} 
          />
        ))}

        {fields.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-4">
            No work experience added yet. Click 'Add Work Experience' or proceed.
          </p>
        )}
      </div>
    </section>
  );
};
export default WorkExperienceSection;
