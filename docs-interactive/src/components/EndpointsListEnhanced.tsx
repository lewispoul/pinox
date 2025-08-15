'use client';

import { useEffect, useState } from 'react';
import { useFavorites } from '../hooks/useFavorites';
import { Endpoint, OpenAPISpec } from '../types/api';
import EndpointCard from './EndpointCard';
import SearchAndFilters from './SearchAndFilters';

export default function EndpointsList() {
  const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
  const [filteredEndpoints, setFilteredEndpoints] = useState<Endpoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [availableTags, setAvailableTags] = useState<Array<{name: string; description: string}>>([]);
  
  const { favorites, isFavorite, toggleFavorite, favoritesCount } = useFavorites();

  useEffect(() => {
    const loadOpenAPISpec = async () => {
      try {
        const response = await fetch('/openapi.json');
        if (!response.ok) {
          throw new Error('Failed to load OpenAPI specification');
        }
        
        const spec: OpenAPISpec = await response.json();
        
        // Extract tags
        if (spec.tags) {
          setAvailableTags(spec.tags);
        }
        
        // Parse endpoints
        const parsedEndpoints: Endpoint[] = [];
        
        for (const [path, pathData] of Object.entries(spec.paths)) {
          for (const [method, methodData] of Object.entries(pathData)) {
            parsedEndpoints.push({
              path,
              method: method.toUpperCase(),
              summary: methodData.summary || '',
              description: methodData.description || '',
              tags: methodData.tags || [],
              requiresAuth: !!methodData.security?.length,
            });
          }
        }
        
        setEndpoints(parsedEndpoints);
        setFilteredEndpoints(parsedEndpoints); // Initialize filtered endpoints
        setLoading(false);
      } catch (err) {
        console.error('Error loading OpenAPI spec:', err);
        setError('Failed to load API endpoints');
        setLoading(false);
      }
    };

    loadOpenAPISpec();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading API endpoints...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Search and Filters */}
      <SearchAndFilters
        endpoints={endpoints}
        onFilteredEndpoints={setFilteredEndpoints}
        availableTags={availableTags}
        favorites={favorites}
        onToggleFavorite={toggleFavorite}
      />

      {/* Endpoints List */}
      <div className="space-y-4">
        {filteredEndpoints.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-6xl mb-4">🔍</div>
            <div className="text-lg font-medium mb-2">No endpoints found</div>
            <div className="text-sm">Try adjusting your search criteria or filters</div>
          </div>
        ) : (
          filteredEndpoints.map((endpoint, index) => {
            const endpointId = `${endpoint.method}-${endpoint.path}`;
            return (
              <EndpointCard 
                key={`${endpoint.method}-${endpoint.path}-${index}`} 
                endpoint={endpoint}
                isFavorite={isFavorite(endpointId)}
                onToggleFavorite={() => toggleFavorite(endpointId)}
              />
            );
          })
        )}
      </div>

      {/* Enhanced Statistics */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600">
              {endpoints.length}
            </div>
            <div className="text-sm text-blue-700 font-medium">Total Endpoints</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600">
              {endpoints.filter(e => e.method === 'GET').length}
            </div>
            <div className="text-sm text-green-700 font-medium">GET Endpoints</div>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4">
            <div className="text-2xl font-bold text-red-600">
              {endpoints.filter(e => e.requiresAuth).length}
            </div>
            <div className="text-sm text-red-700 font-medium">Auth Required</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-600">
              {availableTags.length}
            </div>
            <div className="text-sm text-purple-700 font-medium">Categories</div>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {favoritesCount}
            </div>
            <div className="text-sm text-yellow-700 font-medium">Favorites</div>
          </div>
        </div>
        
        {/* Results Summary */}
        <div className="mt-4 text-center text-sm text-gray-600">
          Showing {filteredEndpoints.length} of {endpoints.length} endpoints
          {favoritesCount > 0 && (
            <span className="ml-2 text-yellow-600">
              • {favoritesCount} favorite{favoritesCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
