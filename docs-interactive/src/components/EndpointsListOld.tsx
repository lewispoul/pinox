'use client';

import { useEffect, useState } from 'react';
import { Endpoint, OpenAPISpec } from '../types/api';
import EndpointCard from './EndpointCard';
import SearchAndFilters from './SearchAndFilters';
import { useFavorites } from '../hooks/useFavorites';

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
      }
    };

    loadOpenAPISpec();
  }, []);

  const filteredEndpoints = endpoints.filter(endpoint => {
    if (selectedTag === 'all') return true;
    return endpoint.tags.includes(selectedTag);
  });

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
      {/* Tag Filter */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedTag('all')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              selectedTag === 'all'
                ? 'bg-blue-100 text-blue-800 border border-blue-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All ({endpoints.length})
          </button>
          {availableTags.map((tag) => {
            const count = endpoints.filter(e => e.tags.includes(tag.name)).length;
            return (
              <button
                key={tag.name}
                onClick={() => setSelectedTag(tag.name)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedTag === tag.name
                    ? 'bg-blue-100 text-blue-800 border border-blue-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title={tag.description}
              >
                {tag.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Endpoints List */}
      <div className="space-y-4">
        {filteredEndpoints.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No endpoints found for the selected tag.
          </div>
        ) : (
          filteredEndpoints.map((endpoint, index) => (
            <EndpointCard key={`${endpoint.method}-${endpoint.path}-${index}`} endpoint={endpoint} />
          ))
        )}
      </div>

      {/* Statistics */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {endpoints.length}
            </div>
            <div className="text-sm text-gray-600">Total Endpoints</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {endpoints.filter(e => e.method === 'GET').length}
            </div>
            <div className="text-sm text-gray-600">GET Endpoints</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">
              {endpoints.filter(e => e.requiresAuth).length}
            </div>
            <div className="text-sm text-gray-600">Secured</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {availableTags.length}
            </div>
            <div className="text-sm text-gray-600">Categories</div>
          </div>
        </div>
      </div>
    </div>
  );
}
