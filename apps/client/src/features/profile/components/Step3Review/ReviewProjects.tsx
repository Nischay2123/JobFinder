import React from 'react';

interface Project {
  title: string;
  description?: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
}

interface ReviewProjectsProps {
  projects: Project[];
  onEdit: () => void;
}

export const ReviewProjects: React.FC<ReviewProjectsProps> = ({ projects, onEdit }) => {
  return (
    <section className="glass-card rounded-xl p-6 top-light">
      <div className="flex justify-between items-center mb-6 border-b border-outline-variant/30 pb-2">
        <h3 className="font-headline-sm text-headline-sm flex items-center gap-2 font-bold text-white text-lg">
          <span className="material-symbols-outlined text-primary">rocket_launch</span>
          Projects
        </h3>
        <button
          type="button"
          onClick={onEdit}
          className="material-symbols-outlined text-gray-400 text-lg hover:text-primary transition-colors cursor-pointer"
        >
          edit
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {projects.map((proj, idx) => (
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
                {(proj.technologies || []).map((tech, tIdx) => (
                  <span key={tIdx} className="px-1.5 py-0.5 bg-surface-container-high rounded text-[10px] text-white border border-outline-variant/30 font-semibold">
                    {tech}
                  </span>
                ))}
              </div>
              
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

        {projects.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-4 col-span-2">
            No personal projects provided.
          </p>
        )}
      </div>
    </section>
  );
};
export default ReviewProjects;
