import React from 'react';

interface NavbarProps {
  left?: React.ReactNode;
  center?: React.ReactNode;
  right?: React.ReactNode;
  className?: string;
  isFixed?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  left,
  center,
  right,
  className = '',
  isFixed = false,
}) => {
  const positionClass = isFixed ? 'fixed' : 'sticky';
  
  return (
    <header className={`${positionClass} top-0 left-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border ${className}`}>
      <div className="flex justify-between items-center w-full px-4 md:px-6 max-w-[1280px] mx-auto h-16">
        {left}
        {center && (
          <div className="flex items-center gap-4">
            {center}
          </div>
        )}
        {right}
      </div>
    </header>
  );
};
export default Navbar;
