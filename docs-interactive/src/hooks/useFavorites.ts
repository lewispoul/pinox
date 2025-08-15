'use client';

import { useCallback, useEffect, useState } from 'react';

export interface FavoritesManager {
  favorites: string[];
  isFavorite: (endpointId: string) => boolean;
  toggleFavorite: (endpointId: string) => void;
  clearFavorites: () => void;
  favoritesCount: number;
}

const FAVORITES_STORAGE_KEY = 'nox-api-favorites';

export function useFavorites(): FavoritesManager {
  const [favorites, setFavorites] = useState<string[]>([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setFavorites(parsed);
        }
      }
    } catch (error) {
      console.warn('Failed to load favorites from localStorage:', error);
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.warn('Failed to save favorites to localStorage:', error);
    }
  }, [favorites]);

  const isFavorite = useCallback((endpointId: string) => {
    return favorites.includes(endpointId);
  }, [favorites]);

  const toggleFavorite = useCallback((endpointId: string) => {
    setFavorites(prev => {
      if (prev.includes(endpointId)) {
        return prev.filter(id => id !== endpointId);
      } else {
        return [...prev, endpointId];
      }
    });
  }, []);

  const clearFavorites = useCallback(() => {
    setFavorites([]);
  }, []);

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    clearFavorites,
    favoritesCount: favorites.length,
  };
}
