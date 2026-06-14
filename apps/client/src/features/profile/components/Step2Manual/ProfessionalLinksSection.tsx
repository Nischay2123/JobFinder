import React from 'react';
import { useFormContext } from 'react-hook-form';

export const ProfessionalLinksSection: React.FC = () => {
  const { register } = useFormContext();

  return (
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
  );
};
export default ProfessionalLinksSection;
