import React from 'react';
import { branding } from '../config/branding';

interface LogoProps {
  variant?: 'full' | 'compact';
}

export const Logo: React.FC<LogoProps> = ({ variant = 'full' }) => {
  return (
    <div className="flex flex-col">
      <div className="flex items-baseline">
        <h1 className="font-extralight tracking-wider text-lg md:text-xl text-apple-gray-600 dark:text-white">
          {branding.productName}
        </h1>
        {variant === 'full' && (
          <span className="text-[8px] md:text-[9px] text-apple-gray-400 dark:text-apple-gray-300 ml-0.5 translate-y-[1px]">
            for
          </span>
        )}
      </div>
      {variant === 'full' && (
        <span className="text-[10px] md:text-xs text-apple-gray-400 dark:text-apple-gray-300 -mt-0.5 line-clamp-1 max-w-[180px] md:max-w-none">
          {branding.institution.name}
        </span>
      )}
    </div>
  );
};