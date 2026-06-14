import React from 'react';

interface ReviewGeneralInfoProps {
  draft: {
    firstName: string;
    lastName: string;
    phone: string;
    currentStatus: string;
    experienceYears: number | null;
  };
  onEdit: () => void;
}

export const ReviewGeneralInfo: React.FC<ReviewGeneralInfoProps> = ({ draft, onEdit }) => {
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'STUDENT':
        return 'Student';
      case 'FRESHER':
        return 'Fresher';
      case 'WORKING_PROFESSIONAL':
        return 'Working Professional';
      default:
        return status;
    }
  };

  return (
    <section className="glass-card rounded-xl p-6 top-light relative">
      <div className="flex justify-between items-center mb-4 border-b border-outline-variant/30 pb-2">
        <h3 className="font-headline-sm text-headline-sm flex items-center gap-2 font-bold text-white text-lg">
          <span className="material-symbols-outlined text-primary">person</span>
          General Info
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
          <p className="font-label-md text-label-md text-gray-400 font-semibold">Full Name</p>
          <p className="font-body-lg text-body-lg text-white">
            {draft.firstName} {draft.lastName}
          </p>
        </div>
        <div>
          <p className="font-label-md text-label-md text-gray-400 font-semibold">Phone Number</p>
          <p className="font-body-lg text-body-lg text-white">{draft.phone}</p>
        </div>
        <div>
          <p className="font-label-md text-label-md text-gray-400 font-semibold">Current Status</p>
          <p className="font-body-lg text-body-lg text-white">{getStatusLabel(draft.currentStatus)}</p>
        </div>
        {draft.experienceYears !== null && (
          <div>
            <p className="font-label-md text-label-md text-gray-400 font-semibold">Years of Experience</p>
            <p className="font-body-lg text-body-lg text-white">{draft.experienceYears} years</p>
          </div>
        )}
      </div>
    </section>
  );
};
export default ReviewGeneralInfo;
