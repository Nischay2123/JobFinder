import React from 'react';
import { useStepBasicInfo } from '../hooks/useStepBasicInfo';

interface StepBasicInfoProps {
  submitRef: React.MutableRefObject<(() => Promise<boolean>) | null>;
  triggerToast: (msg: string) => void;
}

export const StepBasicInfo: React.FC<StepBasicInfoProps> = ({ submitRef, triggerToast }) => {
  const { register, handleSubmit, errors, onSubmit, onError } = useStepBasicInfo(submitRef, triggerToast);

  return (
    <div className="w-full max-w-[480px] glass-card rounded-xl p-8 md:p-10 transition-all duration-300">
      <div className="text-center mb-8">
        <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-white mb-2 font-bold">
          Tell us about yourself
        </h1>
        <p className="font-body-lg text-body-lg text-gray-300">
          Let's start with the basics to customize your profile search.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="font-label-md text-label-md text-gray-300 ml-1 block" htmlFor="firstName">
              First Name<span className="text-red-500 ml-0.5">*</span>
            </label>
            <input
              id="firstName"
              type="text"
              placeholder="John"
              {...register('firstName')}
              className={`w-full bg-surface-container-lowest border rounded-lg px-4 py-3 text-white font-body-md focus:outline-none focus:border-primary-container focus:ring-4 focus:ring-primary-container/20 placeholder:text-outline-variant transition-all ${
                errors.firstName ? 'border-red-500' : 'border-outline-variant'
              }`}
            />
            {errors.firstName && (
              <span className="text-xs text-red-500 block mt-1 ml-1">{errors.firstName.message}</span>
            )}
          </div>

          <div className="space-y-1">
            <label className="font-label-md text-label-md text-gray-300 ml-1 block" htmlFor="lastName">
              Last Name<span className="text-red-500 ml-0.5">*</span>
            </label>
            <input
              id="lastName"
              type="text"
              placeholder="Doe"
              {...register('lastName')}
              className={`w-full bg-surface-container-lowest border rounded-lg px-4 py-3 text-white font-body-md focus:outline-none focus:border-primary-container focus:ring-4 focus:ring-primary-container/20 placeholder:text-outline-variant transition-all ${
                errors.lastName ? 'border-red-500' : 'border-outline-variant'
              }`}
            />
            {errors.lastName && (
              <span className="text-xs text-red-500 block mt-1 ml-1">{errors.lastName.message}</span>
            )}
          </div>
        </div>

        <div className="space-y-1">
          <label className="font-label-md text-label-md text-gray-300 ml-1 block" htmlFor="phone">
            Phone Number<span className="text-red-500 ml-0.5">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 material-symbols-outlined text-[18px]">
              call
            </span>
            <input
              id="phone"
              type="tel"
              placeholder="+1 (555) 000-0000"
              {...register('phone')}
              className={`w-full bg-surface-container-lowest border rounded-lg pl-11 pr-4 py-3 text-white font-body-md focus:outline-none focus:border-primary-container focus:ring-4 focus:ring-primary-container/20 placeholder:text-outline-variant transition-all ${
                errors.phone ? 'border-red-500' : 'border-outline-variant'
              }`}
            />
          </div>
          {errors.phone && (
            <span className="text-xs text-red-500 block mt-1 ml-1">{errors.phone.message}</span>
          )}
        </div>

        <div className="space-y-1">
          <label className="font-label-md text-label-md text-gray-300 ml-1 block" htmlFor="currentStatus">
            Current Status<span className="text-red-500 ml-0.5">*</span>
          </label>
          <div className="relative">
            <select
              id="currentStatus"
              {...register('currentStatus')}
              className={`w-full appearance-none bg-surface-container-lowest border rounded-lg px-4 py-3 text-white font-body-md focus:outline-none focus:border-primary-container focus:ring-4 focus:ring-primary-container/20 transition-all cursor-pointer ${
                errors.currentStatus ? 'border-red-500' : 'border-outline-variant'
              }`}
            >
              <option value="" disabled className="bg-surface-mid text-white">
                Select your status
              </option>
              <option value="STUDENT" className="bg-surface-mid text-white">Student</option>
              <option value="FRESHER" className="bg-surface-mid text-white">Fresher</option>
              <option value="WORKING_PROFESSIONAL" className="bg-surface-mid text-white">Working Professional</option>
            </select>
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 material-symbols-outlined pointer-events-none">
              expand_more
            </span>
          </div>
          {errors.currentStatus && (
            <span className="text-xs text-red-500 block mt-1 ml-1">{errors.currentStatus.message}</span>
          )}
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full py-4 primary-glow text-on-primary-container font-headline-sm rounded-lg flex items-center justify-center gap-2 group transition-transform active:scale-95 text-white font-semibold cursor-pointer"
          >
            <span>Next Step</span>
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </button>
        </div>
      </form>

      <div className="mt-8 pt-6 border-t border-outline-variant/30 flex items-center justify-center gap-2 text-gray-400">
        <span className="material-symbols-outlined text-[16px]">lock</span>
        <p className="font-label-md text-label-md text-gray-400">Your data is securely encrypted</p>
      </div>
    </div>
  );
};
export default StepBasicInfo;
