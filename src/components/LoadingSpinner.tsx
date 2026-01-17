// src/components/LoadingSpinner.tsx
import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
  text?: string;
}

const SIZE_MAP = {
  sm: 'w-5 h-5 border-2',
  md: 'w-8 h-8 border-2',
  lg: 'w-12 h-12 border-3',
} as const;

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  fullScreen = false,
  text 
}) => {
  const spinner = (
    <div className="flex flex-col items-center gap-3" role="status" aria-live="polite">
      <div 
        className={`${SIZE_MAP[size]} border-gray-300 border-t-orange-600 rounded-full animate-spin`}
        aria-hidden="true"
      />
      {text ? (
        <p className="text-sm text-gray-600">{text}</p>
      ) : (
        <span className="sr-only">Loading...</span>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/95 flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      {spinner}
    </div>
  );
};