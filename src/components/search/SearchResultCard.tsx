import React from 'react';
import { GraduationCap, BookOpen, Users } from 'lucide-react';

interface SearchResultCardProps {
  result: any;
  onClick: () => void;
}

export const SearchResultCard: React.FC<SearchResultCardProps> = ({ result, onClick }) => {
  const getIcon = () => {
    if (result.type === 'student') {
      return <GraduationCap className="w-5 h-5 text-apple-blue-500" />;
    } else if (result.type === 'teacher') {
      return <Users className="w-5 h-5 text-apple-blue-500" />;
    }
    return <BookOpen className="w-5 h-5 text-apple-blue-500" />;
  };

  const getTitle = () => {
    return result.name || result.title || 'Unknown';
  };

  const getSubtitle = () => {
    return result.identifier || result.email || 'No identifier';
  };

  return (
    <button
      onClick={onClick}
      className="w-full p-4 text-left hover:bg-apple-gray-100 dark:hover:bg-apple-gray-700/50 rounded-lg transition-colors"
    >
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <div>
          <p className="font-medium text-apple-gray-900 dark:text-white">
            {getTitle()}
          </p>
          <p className="text-sm text-apple-gray-500 dark:text-apple-gray-400">
            {getSubtitle()}
          </p>
        </div>
      </div>
    </button>
  );
}