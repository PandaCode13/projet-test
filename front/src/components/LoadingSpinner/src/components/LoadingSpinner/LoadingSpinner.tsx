// src/components/LoadingSpinner/LoadingSpinner.tsx
import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  text,
  className = '',
}) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12',
  };
  
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative">
        <div className={`${sizeClasses[size]} rounded-full border-2 border-gray-200`}></div>
        <div className={`${sizeClasses[size]} absolute inset-0 rounded-full border-2 border-blue-500 border-t-transparent animate-spin`}></div>
      </div>
      {text && (
        <p className="mt-2 text-sm text-gray-600">{text}</p>
      )}
    </div>
  );
};

// Spinner pour les boutons
export const ButtonSpinner: React.FC = () => (
  <div className="flex items-center justify-center">
    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
    <span className="ml-2">Chargement...</span>
  </div>
);