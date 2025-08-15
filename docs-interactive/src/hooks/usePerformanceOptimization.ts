'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';

// Memory management utilities for performance optimization
export class MemoryManager {
  private static instance: MemoryManager;
  private caches: Map<string, Map<string, any>> = new Map();
  private timers: Map<string, NodeJS.Timeout> = new Map();
  private observers: Set<IntersectionObserver> = new Set();

  static getInstance(): MemoryManager {
    if (!MemoryManager.instance) {
      MemoryManager.instance = new MemoryManager();
    }
    return MemoryManager.instance;
  }

  // Cache management with TTL
  setCache(namespace: string, key: string, value: any, ttl = 5 * 60 * 1000) {
    if (!this.caches.has(namespace)) {
      this.caches.set(namespace, new Map());
    }
    
    const cache = this.caches.get(namespace)!;
    cache.set(key, value);
    
    // Set expiration
    const timerId = setTimeout(() => {
      cache.delete(key);
      this.timers.delete(`${namespace}:${key}`);
    }, ttl);
    
    this.timers.set(`${namespace}:${key}`, timerId);
  }

  getCache(namespace: string, key: string): any {
    const cache = this.caches.get(namespace);
    return cache?.get(key);
  }

  clearCache(namespace?: string) {
    if (namespace) {
      const cache = this.caches.get(namespace);
      if (cache) {
        cache.clear();
      }
    } else {
      this.caches.clear();
    }
    
    // Clear related timers
    this.timers.forEach((timer, key) => {
      if (!namespace || key.startsWith(`${namespace}:`)) {
        clearTimeout(timer);
        this.timers.delete(key);
      }
    });
  }

  // Observer management
  addObserver(observer: IntersectionObserver) {
    this.observers.add(observer);
  }

  removeObserver(observer: IntersectionObserver) {
    observer.disconnect();
    this.observers.delete(observer);
  }

  // Cleanup all resources
  cleanup() {
    this.timers.forEach(timer => clearTimeout(timer));
    this.timers.clear();
    this.caches.clear();
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
  }

  // Memory usage reporting
  getMemoryStats() {
    const stats = {
      caches: this.caches.size,
      timers: this.timers.size,
      observers: this.observers.size,
      cacheEntries: 0
    };

    this.caches.forEach(cache => {
      stats.cacheEntries += cache.size;
    });

    return stats;
  }
}

// React hook for memory-optimized caching
export function useMemoryCache<T>(
  key: string,
  factory: () => T,
  deps: React.DependencyList = [],
  namespace = 'default',
  ttl = 5 * 60 * 1000
): T {
  const memoryManager = useMemo(() => MemoryManager.getInstance(), []);
  
  return useMemo(() => {
    const cached = memoryManager.getCache(namespace, key);
    if (cached !== undefined) {
      return cached;
    }
    
    const value = factory();
    memoryManager.setCache(namespace, key, value, ttl);
    return value;
  }, [key, namespace, ttl, memoryManager, ...deps]);
}

// Hook for debounced values to reduce re-renders
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Hook for throttled callbacks
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const lastRan = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout>();

  return useCallback((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const now = Date.now();
    if (now - lastRan.current >= delay) {
      callback(...args);
      lastRan.current = now;
    } else {
      timeoutRef.current = setTimeout(() => {
        callback(...args);
        lastRan.current = Date.now();
      }, delay - (now - lastRan.current));
    }
  }, [callback, delay]) as T;
}

// Hook for intersection observer with cleanup
export function useIntersectionObserver(
  callback: IntersectionObserverCallback,
  options?: IntersectionObserverInit
) {
  const observerRef = useRef<IntersectionObserver>();
  const memoryManager = useMemo(() => MemoryManager.getInstance(), []);

  const observe = useCallback((element: Element | null) => {
    if (observerRef.current) {
      memoryManager.removeObserver(observerRef.current);
    }

    if (element) {
      observerRef.current = new IntersectionObserver(callback, options);
      memoryManager.addObserver(observerRef.current);
      observerRef.current.observe(element);
    }
  }, [callback, options, memoryManager]);

  const disconnect = useCallback(() => {
    if (observerRef.current) {
      memoryManager.removeObserver(observerRef.current);
      observerRef.current = undefined;
    }
  }, [memoryManager]);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return { observe, disconnect };
}

// Hook for optimized re-renders
export function useOptimizedCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList
): T {
  const callbackRef = useRef<T>(callback);
  const depsRef = useRef<React.DependencyList>(deps);

  // Update callback if deps changed
  useEffect(() => {
    const depsChanged = deps.length !== depsRef.current.length ||
      deps.some((dep, i) => dep !== depsRef.current[i]);
    
    if (depsChanged) {
      callbackRef.current = callback;
      depsRef.current = deps;
    }
  });

  return useCallback((...args: Parameters<T>) => {
    return callbackRef.current(...args);
  }, []) as T;
}

// Hook for component mount/unmount tracking
export function useComponentLifecycle(componentName: string) {
  const startTime = useRef<number>(performance.now());
  
  useEffect(() => {
    const mountTime = performance.now() - startTime.current;
    console.log(`🔧 ${componentName} mounted in ${mountTime.toFixed(2)}ms`);
    
    return () => {
      const unmountTime = performance.now() - startTime.current;
      console.log(`🔧 ${componentName} unmounted after ${unmountTime.toFixed(2)}ms`);
    };
  }, [componentName]);
}

// Hook for memory leak detection in development
export function useMemoryLeakDetection(componentName: string) {
  const cleanupFunctions = useRef<(() => void)[]>([]);
  
  const addCleanup = useCallback((cleanup: () => void) => {
    cleanupFunctions.current.push(cleanup);
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const checkLeaks = () => {
        if (cleanupFunctions.current.length > 10) {
          console.warn(`⚠️ ${componentName} has ${cleanupFunctions.current.length} cleanup functions. Possible memory leak.`);
        }
      };

      const interval = setInterval(checkLeaks, 5000);
      addCleanup(() => clearInterval(interval));
    }

    return () => {
      cleanupFunctions.current.forEach(cleanup => cleanup());
      cleanupFunctions.current = [];
    };
  }, [componentName, addCleanup]);

  return { addCleanup };
}

// Bundle size analysis utilities
export function analyzeBundleSize() {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    const scripts = Array.from(document.querySelectorAll('script[src]'));
    const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
    
    console.group('📦 Bundle Analysis');
    console.log(`Scripts: ${scripts.length}`);
    console.log(`Stylesheets: ${styles.length}`);
    
    scripts.forEach((script: any) => {
      console.log(`JS: ${script.src}`);
    });
    
    styles.forEach((style: any) => {
      console.log(`CSS: ${style.href}`);
    });
    console.groupEnd();
  }
}

// Performance monitoring hook
export function usePerformanceProfiler(componentName: string, enabled = false) {
  const renderStart = useRef<number>();
  const renderCount = useRef<number>(0);

  if (enabled && typeof window !== 'undefined') {
    renderStart.current = performance.now();
  }

  useEffect(() => {
    if (enabled && renderStart.current) {
      const renderTime = performance.now() - renderStart.current;
      renderCount.current++;
      
      console.log(`⚡ ${componentName} render #${renderCount.current}: ${renderTime.toFixed(2)}ms`);
    }
  });

  return { renderCount: renderCount.current };
}

// Import React for useState
import { useState } from 'react';

// Monitor hook for WebVitals component
export function usePerformanceMonitor() {
  const [isOptimizing, setIsOptimizing] = useState(false);

  const optimizePerformance = useCallback(() => {
    setIsOptimizing(true);
    
    // Simulate performance optimization
    setTimeout(() => {
      setIsOptimizing(false);
    }, 2000);
  }, []);

  return { isOptimizing, optimizePerformance };
}
