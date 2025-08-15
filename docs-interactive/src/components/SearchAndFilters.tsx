'use client';

import debounce from 'lodash.debounce';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Endpoint } from '../types/api';

interface SearchAndFiltersProps {
  endpoints: Endpoint[];
  onFilteredEndpoints: (filtered: Endpoint[]) => void;
  availableTags: Array<{name: string; description: string}>;
  favorites: string[];
}

type SortOption = 'name' | 'method' | 'recent' | 'favorites';

export default function SearchAndFilters({ 
  endpoints, 
  onFilteredEndpoints, 
  availableTags,
  favorites
}: SearchAndFiltersProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [selectedMethods, setSelectedMethods] = useState<Set<string>>(new Set());
  const [showOnlyAuth, setShowOnlyAuth] = useState(false);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];

  // Create debounced search function
  const debouncedSearch = useMemo(
    () => debounce((query: string) => {
      setSearchQuery(query);
    }, 300),
    []
  );

  // Update search query with debouncing
  useEffect(() => {
    debouncedSearch(localSearchQuery);
    
    // Cleanup function to cancel pending debounced calls
    return () => {
      debouncedSearch.cancel();
    };
  }, [localSearchQuery, debouncedSearch]);

  const filterAndSortEndpoints = useCallback(() => {
    const filtered = endpoints.filter(endpoint => {
      const endpointId = `${endpoint.method}-${endpoint.path}`;
      
      // Search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          endpoint.path.toLowerCase().includes(query) ||
          endpoint.summary.toLowerCase().includes(query) ||
          endpoint.description.toLowerCase().includes(query) ||
          endpoint.tags.some(tag => tag.toLowerCase().includes(query));
        
        if (!matchesSearch) return false;
      }

      // Tag filter
      if (selectedTag !== 'all' && !endpoint.tags.includes(selectedTag)) {
        return false;
      }

      // Method filter
      if (selectedMethods.size > 0 && !selectedMethods.has(endpoint.method)) {
        return false;
      }

      // Auth filter
      if (showOnlyAuth && !endpoint.requiresAuth) {
        return false;
      }

      // Favorites filter
      if (showOnlyFavorites && !favorites.includes(endpointId)) {
        return false;
      }

      return true;
    });

    // Sort endpoints
    filtered.sort((a, b) => {
      const aId = `${a.method}-${a.path}`;
      const bId = `${b.method}-${b.path}`;
      
      switch (sortBy) {
        case 'method':
          if (a.method !== b.method) return a.method.localeCompare(b.method);
          return a.path.localeCompare(b.path);
        
        case 'favorites':
          const aFav = favorites.includes(aId);
          const bFav = favorites.includes(bId);
          if (aFav !== bFav) return bFav ? 1 : -1;
          return a.path.localeCompare(b.path);
        
        case 'recent':
          // For now, sort by path (could integrate with usage tracking later)
          return a.path.localeCompare(b.path);
        
        case 'name':
        default:
          return a.path.localeCompare(b.path);
      }
    });

    onFilteredEndpoints(filtered);
  }, [
    endpoints, 
    searchQuery, 
    selectedTag, 
    selectedMethods, 
    showOnlyAuth, 
    showOnlyFavorites, 
    sortBy, 
    favorites, 
    onFilteredEndpoints
  ]);

  // Apply filters whenever dependencies change
  React.useEffect(() => {
    filterAndSortEndpoints();
  }, [filterAndSortEndpoints]);

  const handleMethodToggle = (method: string) => {
    const newMethods = new Set(selectedMethods);
    if (newMethods.has(method)) {
      newMethods.delete(method);
    } else {
      newMethods.add(method);
    }
    setSelectedMethods(newMethods);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTag('all');
    setSelectedMethods(new Set());
    setShowOnlyAuth(false);
    setShowOnlyFavorites(false);
    setSortBy('name');
  };

  const hasActiveFilters = 
    searchQuery ||
    selectedTag !== 'all' ||
    selectedMethods.size > 0 ||
    showOnlyAuth ||
    showOnlyFavorites ||
    sortBy !== 'name';

  return (
    <div className="mb-6 space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search endpoints by path, description, or tags..."
          value={localSearchQuery}
          onChange={(e) => setLocalSearchQuery(e.target.value)}
          className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm text-sm transition-all duration-200 hover:shadow-md"
        />
        {localSearchQuery && (
          <button
            onClick={() => setLocalSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        {/* Tag Filter */}
        <select
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Tags</option>
          {availableTags.map((tag) => {
            const count = endpoints.filter(e => e.tags.includes(tag.name)).length;
            return (
              <option key={tag.name} value={tag.name}>
                {tag.name} ({count})
              </option>
            );
          })}
        </select>

        {/* Sort Options */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="name">Sort by Path</option>
          <option value="method">Sort by Method</option>
          <option value="favorites">Favorites First</option>
          <option value="recent">Recently Used</option>
        </select>

        {/* Toggle Filters */}
        <button
          onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1 ${
            showOnlyFavorites
              ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-300'
          }`}
        >
          ⭐ Favorites Only
          {favorites.length > 0 && (
            <span className="bg-yellow-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {favorites.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setShowOnlyAuth(!showOnlyAuth)}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            showOnlyAuth
              ? 'bg-red-100 text-red-800 border border-red-300'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-300'
          }`}
        >
          🔒 Auth Required
        </button>

        {/* Advanced Filters Toggle */}
        <button
          onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
          className="px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-300 transition-colors"
        >
          ⚙️ Advanced {isAdvancedOpen ? '▲' : '▼'}
        </button>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="px-3 py-2 rounded-lg text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 border border-red-300 transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Advanced Filters Panel */}
      {isAdvancedOpen && (
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-4 animate-slide-down">
          <h3 className="text-sm font-semibold text-gray-700">HTTP Methods</h3>
          <div className="flex flex-wrap gap-2">
            {methods.map(method => {
              const count = endpoints.filter(e => e.method === method).length;
              const isSelected = selectedMethods.has(method);
              
              if (count === 0) return null;
              
              return (
                <button
                  key={method}
                  onClick={() => handleMethodToggle(method)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isSelected
                      ? getMethodStyle(method).selected
                      : `bg-gray-200 text-gray-600 hover:bg-gray-300 border border-gray-300`
                  }`}
                >
                  {method} ({count})
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-200">
          <span className="font-medium">Active filters:</span>
          {searchQuery && <span className="ml-2">Search: &quot;{searchQuery}&quot;</span>}
          {selectedTag !== 'all' && <span className="ml-2">Tag: {selectedTag}</span>}
          {selectedMethods.size > 0 && <span className="ml-2">Methods: {Array.from(selectedMethods).join(', ')}</span>}
          {showOnlyAuth && <span className="ml-2">Auth Required</span>}
          {showOnlyFavorites && <span className="ml-2">Favorites Only</span>}
          {sortBy !== 'name' && <span className="ml-2">Sort: {sortBy}</span>}
        </div>
      )}
    </div>
  );
}

function getMethodStyle(method: string) {
  const styles: { [key: string]: { selected: string } } = {
    'GET': { selected: 'bg-blue-100 text-blue-800 border border-blue-300' },
    'POST': { selected: 'bg-green-100 text-green-800 border border-green-300' },
    'PUT': { selected: 'bg-yellow-100 text-yellow-800 border border-yellow-300' },
    'DELETE': { selected: 'bg-red-100 text-red-800 border border-red-300' },
    'PATCH': { selected: 'bg-purple-100 text-purple-800 border border-purple-300' },
  };
  
  return styles[method] || styles['GET'];
}
