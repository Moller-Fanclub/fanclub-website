import React, { type ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '6xl' | '7xl';
}

const PageContainer: React.FC<PageContainerProps> = ({ 
  children, 
  className = '',
  maxWidth = '7xl'
}) => {
  const maxWidthClasses = {
    'sm': 'max-w-sm',
    'md': 'max-w-md',
    'lg': 'max-w-lg',
    'xl': 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl'
  };

  return (
    <div className="flex-1 py-8">
      <div className={`pt-24 pb-8 mx-auto ${maxWidthClasses[maxWidth]} px-4 ${className}`}>
        {children}
      </div>
    </div>
  );
};

export default PageContainer;
