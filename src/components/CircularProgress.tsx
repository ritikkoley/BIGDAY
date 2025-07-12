import React from 'react';

interface CircularProgressProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  children?: React.ReactNode;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  progress,
  size = 120,
  strokeWidth = 8,
  children
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  const getProgressDetails = (currentProgress: number) => {
    if (currentProgress < 50) {
      return {
        color: 'text-red-500',
        nextMilestone: 50,
        ghostColor: 'text-red-200/30'
      };
    } else if (currentProgress < 75) {
      return {
        color: 'text-yellow-500',
        nextMilestone: 75,
        ghostColor: 'text-yellow-200/30'
      };
    } else {
      return {
        color: 'text-apple-blue-500',
        nextMilestone: 100,
        ghostColor: 'text-apple-blue-500/30'
      };
    }
  };

  const { color, nextMilestone, ghostColor } = getProgressDetails(progress);
  const progressOffset = circumference - (progress / 100) * circumference;
  const ghostOffset = circumference - (nextMilestone / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        className="transform -rotate-90"
        width={size}
        height={size}
      >
        <circle
          className="text-apple-gray-100 dark:text-apple-gray-600"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        
        <circle
          className={`${ghostColor} transition-all duration-300`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={ghostOffset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        
        <circle
          className={`${color} transition-all duration-300`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={progressOffset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};