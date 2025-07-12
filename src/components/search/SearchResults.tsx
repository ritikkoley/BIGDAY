import React from 'react';
import { SearchResultCard } from './SearchResultCard';
import { Loader2, AlertCircle } from 'lucide-react';

interface SearchResultsProps {
  results: any[];
  isLoading: boolean;
  error: string | null;
  onResultClick: (result: any) => void;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  isLoading,
  error,
  onResultClick,
}) => {
  if (isLoading) {
    return (
      <div className="search-results-container p-4">
        <div className="flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-apple-blue-500 animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="search-results-container p-4">
        <div className="flex items-center justify-center space-x-2 text-red-500 dark:text-red-400">
          <AlertCircle className="w-5 h-5" />
          <span>Search is currently unavailable</span>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="search-results-container p-4">
        <div className="text-center text-apple-gray-400 dark:text-apple-gray-500">
          No results found
        </div>
      </div>
    );
  }

  return (
    <div className="search-results-container divide-y divide-apple-gray-200 dark:divide-apple-gray-700">
      {results.map((result) => (
        <SearchResultCard
          key={result.id}
          result={result}
          onClick={() => onResultClick(result)}
        />
      ))}
    </div>
  );
};