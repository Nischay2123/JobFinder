import React from 'react';

interface FooterProps {
  variant?: 'default' | 'landing' | 'onboarding' | 'auth';
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ variant = 'default', className = '' }) => {
  const currentYear = new Date().getFullYear();

  if (variant === 'landing') {
    return (
      <footer className={`mt-auto py-12 border-t border-border-subtle ${className}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-text-muted">
            © {currentYear} JobFinder. All rights reserved. Built for high-performance careers.
          </p>
          <div className="flex gap-8">
            <a className="text-sm text-text-muted hover:text-text-primary transition-colors" href="#">Privacy</a>
            <a className="text-sm text-text-muted hover:text-text-primary transition-colors" href="#">Terms</a>
            <a className="text-sm text-text-muted hover:text-text-primary transition-colors" href="#">Help</a>
          </div>
        </div>
      </footer>
    );
  }

  if (variant === 'onboarding') {
    return (
      <footer className={`w-full py-6 px-4 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-border bg-surface-lowest z-10 ${className}`}>
        <div className="font-headline-md text-headline-md font-bold text-primary text-lg">
          JobFinder AI
        </div>
        <div className="flex gap-6">
          <a className="font-label-sm text-label-sm text-gray-400 hover:text-text-primary transition-colors text-xs" href="#">
            Privacy Policy
          </a>
          <a className="font-label-sm text-label-sm text-gray-400 hover:text-text-primary transition-colors text-xs" href="#">
            Terms of Service
          </a>
          <a className="font-label-sm text-label-sm text-gray-400 hover:text-text-primary transition-colors text-xs" href="#">
            Help Center
          </a>
        </div>
        <div className="font-label-sm text-label-sm text-gray-400 text-xs">
          © {currentYear} JobFinder AI. All rights reserved.
        </div>
      </footer>
    );
  }

  return (
    <footer className={`py-8 text-center relative z-10 mt-auto ${className}`}>
      <p className="text-xs text-text-muted">
        © {currentYear} JobFinder. Built for high-performance careers.
      </p>
      {variant !== 'auth' && (
        <div className="mt-4 flex justify-center gap-6">
          <a className="text-xs text-text-muted hover:text-text-primary transition-colors" href="#">Privacy Policy</a>
          <a className="text-xs text-text-muted hover:text-text-primary transition-colors" href="#">Terms of Service</a>
        </div>
      )}
    </footer>
  );
};
export default Footer;
