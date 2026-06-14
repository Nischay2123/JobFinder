import React from 'react';

interface ReviewLinksProps {
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  onEdit: () => void;
}

export const ReviewLinks: React.FC<ReviewLinksProps> = ({
  linkedinUrl,
  githubUrl,
  portfolioUrl,
  onEdit,
}) => {
  return (
    <section className="glass-card rounded-xl p-6 top-light">
      <div className="flex justify-between items-center mb-4 border-b border-outline-variant/30 pb-2">
        <h3 className="font-headline-sm text-headline-sm flex items-center gap-2 font-bold text-white text-lg">
          <span className="material-symbols-outlined text-primary">link</span>
          Links
        </h3>
        <button
          type="button"
          onClick={onEdit}
          className="material-symbols-outlined text-gray-400 text-lg hover:text-primary transition-colors cursor-pointer"
        >
          edit
        </button>
      </div>
      <div className="space-y-3 text-sm">
        {linkedinUrl && (
          <div className="flex items-center gap-2 text-white font-medium">
            <span className="material-symbols-outlined text-base text-primary">public</span>
            <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-white hover:text-primary hover:underline truncate">
              LinkedIn
            </a>
          </div>
        )}
        {githubUrl && (
          <div className="flex items-center gap-2 text-white font-medium">
            <span className="material-symbols-outlined text-base text-primary font-bold">code</span>
            <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="text-white hover:text-primary hover:underline truncate">
              GitHub
            </a>
          </div>
        )}
        {portfolioUrl && (
          <div className="flex items-center gap-2 text-white font-medium">
            <span className="material-symbols-outlined text-base text-primary">portrait</span>
            <a href={portfolioUrl} target="_blank" rel="noopener noreferrer" className="text-white hover:text-primary hover:underline truncate">
              Portfolio
            </a>
          </div>
        )}
        {!linkedinUrl && !githubUrl && !portfolioUrl && (
          <p className="text-xs text-gray-400">No links provided</p>
        )}
      </div>
    </section>
  );
};
export default ReviewLinks;
