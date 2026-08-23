import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  color?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className = '',
  color = 'text-brand-600',
}) => {
  const sizeMap = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-10 h-10 border-3',
    xl: 'w-14 h-14 border-4',
  };

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <div
        className={`${sizeMap[size]} ${color} border-t-transparent rounded-full animate-spin`}
        role="status"
        aria-label="Loading"
      />
    </div>
  );
};
