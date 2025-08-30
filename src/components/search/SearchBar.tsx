import React, { useState, useRef } from 'react';
import { X } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';
import { useSearchStore } from '../../stores/searchStore';
import { SearchResults } from './SearchResults';

interface SearchBarProps {
  onSearch: (query: string, filters: any) => void;
  permissions: {
    student: string[];
    teacher: string[];
    admin: string[];
  };
  role: 'student' | 'teacher' | 'admin';
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, role }) => {
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebounce(query, 300);

  const { results, isLoading, error, search, clearSearch } = useSearchStore();

  useOnClickOutside(searchRef, () => {
    setShowResults(false);
  });

  React.useEffect(() => {
    if (debouncedQuery.trim()) {
      search(debouncedQuery, role);
      setShowResults(true);
    } else {
      clearSearch();
      setShowResults(false);
    }
  }, [debouncedQuery, role, search, clearSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim(), {});
      setShowResults(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (query.trim()) {
        onSearch(query.trim(), {});
        setShowResults(true);
      }
    } else if (e.key === 'Escape') {
      setShowResults(false);
      inputRef.current?.blur();
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuery('');
    clearSearch();
    setShowResults(false);
    inputRef.current?.blur();
  };

  const handleResultClick = (result: any) => {
    console.log('Selected result:', result);
    setShowResults(false);
  };

  const getPlaceholder = () => {
    switch (role) {
      case 'student':
        return 'Search courses (e.g., C-1001)';
      case 'teacher':
        return 'Search students (e.g., S-123456) or courses';
      case 'admin':
        return 'Search students, teachers, or courses';
      default:
        return 'Search';
    }
  };

  return (
    <div ref={searchRef} className="search-container">
      <form 
        onSubmit={handleSubmit}
        className="search-wrapper"
      >
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={getPlaceholder()}
          className="search-input"
          aria-label="Search"
        />
        {query && (
          <button 
            onClick={handleClear}
            type="button"
            className="search-clear-button"
            aria-label="Clear search"
          >
            <div className="search-clear-circle">
              <X size={12} strokeWidth={2.5} />
            </div>
          </button>
        )}
      </form>

      {showResults && (
        <SearchResults
          results={results}
          isLoading={isLoading}
          error={error}
          onResultClick={handleResultClick}
        />
      )}
    </div>
  );
};