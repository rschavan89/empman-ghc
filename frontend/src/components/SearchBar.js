import React, { useState } from 'react';
import '../styles/search-bar.css';

/**
 * SearchBar Component
 * Handles employee search functionality
 */
const SearchBar = ({
  onSearch,
  placeholder = 'Search by name, email, or department...',
  isLoading = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    // Debounce search - optional
    onSearch(term);
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        className="search-input"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleChange}
        disabled={isLoading}
        aria-label="Search employees"
      />
      {searchTerm && (
        <button
          className="search-clear"
          onClick={handleClear}
          disabled={isLoading}
          aria-label="Clear search"
          type="button"
        >
          ✕
        </button>
      )}
      <span className="search-icon">🔍</span>
    </div>
  );
};

export default SearchBar;
