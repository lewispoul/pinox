'use client';

import React, { memo } from 'react';
import { FixedSizeList as List } from 'react-window';
import { Endpoint } from '../types/api';
import EndpointCard from './EndpointCard';

interface VirtualizedEndpointsListProps {
  endpoints: Endpoint[];
  favorites: string[];
  onToggleFavorite: (endpointId: string) => void;
  height?: number;
  itemHeight?: number;
}

interface ItemRendererProps {
  index: number;
  style: React.CSSProperties;
  data: {
    endpoints: Endpoint[];
    favorites: string[];
    onToggleFavorite: (endpointId: string) => void;
  };
}

const ItemRenderer = memo(({ index, style, data }: ItemRendererProps) => {
  const { endpoints, favorites, onToggleFavorite } = data;
  const endpoint = endpoints[index];
  
  if (!endpoint) return null;
  
  const endpointId = `${endpoint.method}-${endpoint.path}`;
  const isFavorite = favorites.includes(endpointId);

  return (
    <div style={style} className="px-1">
      <div className="pb-4">
        <EndpointCard
          endpoint={endpoint}
          isFavorite={isFavorite}
          onToggleFavorite={() => onToggleFavorite(endpointId)}
        />
      </div>
    </div>
  );
});

ItemRenderer.displayName = 'VirtualizedEndpointItem';

const VirtualizedEndpointsList: React.FC<VirtualizedEndpointsListProps> = ({
  endpoints,
  favorites,
  onToggleFavorite,
  height = 600,
  itemHeight = 200
}) => {
  if (!endpoints || endpoints.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No endpoints found</h3>
          <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filters.</p>
        </div>
      </div>
    );
  }

  // Prepare data for the virtual list
  const itemData = {
    endpoints,
    favorites,
    onToggleFavorite
  };

  return (
    <div className="border rounded-lg bg-white shadow-sm">
      <div className="p-4 border-b bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-900">
          API Endpoints ({endpoints.length})
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          {endpoints.length > 100 
            ? `Using virtualization for optimal performance with ${endpoints.length} items`
            : `Showing ${endpoints.length} endpoint${endpoints.length === 1 ? '' : 's'}`
          }
        </p>
      </div>
      
      <div className="p-4">
        <List
          height={height}
          width="100%"
          itemCount={endpoints.length}
          itemSize={itemHeight}
          itemData={itemData}
          className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
        >
          {ItemRenderer}
        </List>
      </div>
    </div>
  );
};

export default memo(VirtualizedEndpointsList);
