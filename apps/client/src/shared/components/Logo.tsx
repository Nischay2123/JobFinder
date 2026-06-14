import React from 'react';

interface LogoProps {
  variant?: 'default' | 'landing' | 'dashboard' | 'onboarding' | 'footer-brand';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ variant = 'default', className = '' }) => {
  if (variant === 'landing') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <span className="text-xl font-bold tracking-tight">JobFinder</span>
      </div>
    );
  }
  if (variant === 'dashboard') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <span className="material-symbols-outlined text-primary text-2xl font-bold">rocket_launch</span>
        <span className="font-headline-md text-headline-md font-bold text-white text-xl tracking-tight">
          JobFinder<span className="text-primary-container">AI</span>
        </span>
      </div>
    );
  }
  if (variant === 'onboarding') {
    return (
      <div className={`font-headline-md text-headline-md font-bold text-primary text-xl ${className}`}>
        JobFinder
      </div>
    );
  }
  if (variant === 'footer-brand') {
    return (
      <div className={`font-headline-md text-headline-md font-bold text-primary text-lg ${className}`}>
        JobFinder AI
      </div>
    );
  }
  return (
    <div className={`font-headline-md text-headline-md font-bold text-primary text-xl ${className}`}>
      JobFinder
    </div>
  );
};
export default Logo;
