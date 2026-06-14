import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { ProjectItemForm } from './ProjectItemForm';

export const PersonalProjectsSection: React.FC = () => {
  const { control } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'projects',
  });

  return (
    <section className="space-y-6">
      <div className="flex justify-between items-center mb-4 border-b border-outline-variant/30 pb-2">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">rocket_launch</span>
          <h2 className="font-headline-sm text-headline-sm font-semibold text-lg text-white">Personal Projects</h2>
        </div>
        <button
          onClick={() =>
            append({
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
        {fields.map((field, idx) => (
          <ProjectItemForm 
            key={field.id} 
            index={idx} 
            onRemove={() => remove(idx)} 
          />
        ))}

        {fields.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-4">
            No personal projects added yet. Click 'Add Project' or proceed.
          </p>
        )}
      </div>
    </section>
  );
};
export default PersonalProjectsSection;
