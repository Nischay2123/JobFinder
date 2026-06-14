import React from 'react';

interface Location {
  city: string;
  state?: string;
}

interface ReviewPreferencesProps {
  preferredRoles: string[];
  preferredLocations: Location[];
  skills: string[];
  onEdit: () => void;
}

export const ReviewPreferences: React.FC<ReviewPreferencesProps> = ({
  preferredRoles,
  preferredLocations,
  skills,
  onEdit,
}) => {
  return (
    <section className="glass-card rounded-xl p-6 top-light">
      <div className="flex justify-between items-center mb-4 border-b border-outline-variant/30 pb-2">
        <h3 className="font-headline-sm text-headline-sm flex items-center gap-2 font-bold text-white text-lg">
          <span className="material-symbols-outlined text-primary">settings_suggest</span>
          Preferences
        </h3>
        <button
          type="button"
          onClick={onEdit}
          className="material-symbols-outlined text-gray-400 text-lg hover:text-primary transition-colors cursor-pointer"
        >
          edit
        </button>
      </div>
      <div className="space-y-4 text-sm">
        <div>
          <p className="font-label-md text-label-md text-gray-400 mb-2 font-semibold">Preferred Roles</p>
          <div className="flex flex-wrap gap-1.5">
            {preferredRoles.map((role, i) => (
              <span key={i} className="px-2.5 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-semibold">
                {role}
              </span>
            ))}
            {preferredRoles.length === 0 && <span className="text-xs text-gray-400">-</span>}
          </div>
        </div>
        <div>
          <p className="font-label-md text-label-md text-gray-400 mb-2 font-semibold">Preferred Locations</p>
          <div className="flex flex-wrap gap-1.5">
            {preferredLocations.map((loc, i) => (
              <span key={i} className="px-2.5 py-0.5 bg-tertiary-container/10 text-tertiary border border-tertiary/20 rounded-full text-xs font-semibold">
                {loc.city}
                {loc.state ? `, ${loc.state}` : ''}
              </span>
            ))}
            {preferredLocations.length === 0 && <span className="text-xs text-gray-400">-</span>}
          </div>
        </div>
        <div>
          <p className="font-label-md text-label-md text-gray-400 mb-2 font-semibold">Core Skills</p>
          <div className="flex flex-wrap gap-1.5">
            {skills.map((skill, i) => (
              <span key={i} className="px-2.5 py-0.5 bg-secondary-container/20 text-secondary border border-secondary/30 rounded-full text-xs font-semibold">
                {skill}
              </span>
            ))}
            {skills.length === 0 && <span className="text-xs text-gray-400">-</span>}
          </div>
        </div>
      </div>
    </section>
  );
};
export default ReviewPreferences;
