import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';

interface ProjectItemFormProps {
  index: number;
  onRemove: () => void;
}

export const ProjectItemForm: React.FC<ProjectItemFormProps> = ({ index, onRemove }) => {
  const { register, setValue, watch, formState: { errors } } = useFormContext();
  const projectErrors = (errors.projects as any)?.[index];

  const [techInput, setTechInput] = useState('');
  const technologies: string[] = watch(`projects.${index}.technologies`) || [];

  const addTech = () => {
    const val = techInput.trim();
    if (val && !technologies.includes(val)) {
      setValue(`projects.${index}.technologies`, [...technologies, val]);
      setTechInput('');
    }
  };

  const removeTech = (techIdx: number) => {
    setValue(
      `projects.${index}.technologies`,
      technologies.filter((_, i) => i !== techIdx)
    );
  };

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

      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">Project Title<span className="text-red-500 ml-0.5">*</span></label>
          <input
            type="text"
            placeholder="e.g. AI Portfolio Generator"
            {...register(`projects.${index}.title` as const, { required: 'Project title is required' })}
            className={`w-full bg-surface-container-lowest border rounded-lg px-3 py-2 text-body-md text-white focus:outline-none focus:border-primary-container focus:ring-4 focus:ring-primary-container/20 transition-all outline-none ${
              projectErrors?.title ? 'border-red-500' : 'border-outline-variant'
            }`}
          />
          {projectErrors?.title && (
            <span className="text-xs text-red-500 block mt-1 ml-1">{projectErrors.title?.message}</span>
          )}
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">Description</label>
          <textarea
            placeholder="What did you build and why?"
            rows={3}
            {...register(`projects.${index}.description` as const)}
            className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 text-body-md text-white focus:outline-none focus:border-primary-container focus:ring-4 focus:ring-primary-container/20 transition-all outline-none custom-scrollbar"
          />
        </div>

        <div className="grid grid-cols-1 gap-4">
          {/* Project Technologies */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Technologies Used</label>
            <div className="flex flex-wrap gap-2 p-2 bg-surface-container-lowest border border-outline-variant rounded-lg min-h-[42px] focus-within:border-primary transition-all">
              {technologies.map((t, tIdx) => (
                <span
                  key={tIdx}
                  className="px-2 py-0.5 bg-secondary-container/20 text-secondary border border-secondary/30 rounded-full text-xs flex items-center gap-1 font-semibold"
                >
                  {t}
                  <button
                    type="button"
                    onClick={() => removeTech(tIdx)}
                    className="material-symbols-outlined text-[12px] cursor-pointer hover:text-white"
                  >
                    close
                  </button>
                </span>
              ))}
              <input
                type="text"
                placeholder="Add tech..."
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTech();
                  }
                }}
                className="bg-transparent border-none focus:outline-none focus:ring-0 text-body-md placeholder:text-outline p-0 flex-1 min-w-[80px] outline-none text-white"
              />
              <button
                type="button"
                onClick={addTech}
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
                {...register(`projects.${index}.githubUrl` as const)}
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 text-body-md text-white focus:outline-none focus:border-primary-container focus:ring-4 focus:ring-primary-container/20 transition-all outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Live/Demo Link</label>
              <input
                type="url"
                placeholder="https://..."
                {...register(`projects.${index}.liveUrl` as const)}
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 text-body-md text-white focus:outline-none focus:border-primary-container focus:ring-4 focus:ring-primary-container/20 transition-all outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProjectItemForm;
