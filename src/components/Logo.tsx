import React from 'react';
import { branding } from '../config/branding';

interface LogoProps {
  variant?: 'full' | 'compact';
}

export const Logo: React.FC<LogoProps> = ({ variant = 'full' }) => {
  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center">
        <h1 className="font-extralight tracking-wider text-base md:text-lg text-apple-gray-600 dark:text-white">
          {branding.productName}
        </h1>
        {variant === 'full' && (
          <span className="text-xs text-apple-gray-400 dark:text-apple-gray-300 ml-1">
            for
          </span>
        )}
      </div>
      {variant === 'full' && (
        <span className="text-xs text-apple-gray-400 dark:text-apple-gray-300 line-clamp-1 max-w-[120px] md:max-w-[200px]">
          {branding.institution.name}
        </span>
      )}
    </div>
  );
};