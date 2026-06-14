import React from 'react';

interface Experience {
  companyName: string;
  role: string;
  employmentType?: string;
  startDate: string;
  endDate?: string | null;
  isCurrent: boolean;
  description?: string;
}

interface ReviewExperiencesProps {
  experiences: Experience[];
  onEdit: () => void;
}

export const ReviewExperiences: React.FC<ReviewExperiencesProps> = ({ experiences, onEdit }) => {
  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  return (
    <section className="glass-card rounded-xl p-6 top-light">
      <div className="flex justify-between items-center mb-6 border-b border-outline-variant/30 pb-2">
        <h3 className="font-headline-sm text-headline-sm flex items-center gap-2 font-bold text-white text-lg">
          <span className="material-symbols-outlined text-primary">work</span>
          Experiences
        </h3>
        <button
          type="button"
          onClick={onEdit}
          className="material-symbols-outlined text-gray-400 text-lg hover:text-primary transition-colors cursor-pointer"
        >
          edit
        </button>
      </div>
      <div className="space-y-6">
        {experiences.map((exp, idx) => (
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
            {idx < experiences.length - 1 && <div className="border-t border-outline-variant/30 mt-4"></div>}
          </div>
        ))}

        {experiences.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-4">
            No work experience provided.
          </p>
        )}
      </div>
    </section>
  );
};
export default ReviewExperiences;
