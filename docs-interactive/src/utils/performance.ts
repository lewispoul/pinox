/**
 * Performance monitoring utilities for NOX API Documentation
 * Tracks Core Web Vitals and API performance metrics
 */

interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: number;
}

interface WebVitalsMetrics {
  LCP?: PerformanceMetric;  // Largest Contentful Paint
  FID?: PerformanceMetric;  // First Input Delay  
  CLS?: PerformanceMetric;  // Cumulative Layout Shift
  FCP?: PerformanceMetric;  // First Contentful Paint
  TTFB?: PerformanceMetric; // Time to First Byte
}

class PerformanceMonitor {
  private metrics: WebVitalsMetrics = {};
  private apiMetrics: Map<string, number[]> = new Map();
  private observers: Map<string, PerformanceObserver> = new Map();

  constructor() {
    this.initializeWebVitals();
    this.initializeApiTracking();
  }

  private initializeWebVitals() {
    // LCP - Largest Contentful Paint
    this.observeMetric('largest-contentful-paint', (entries) => {
      const lcp = entries[entries.length - 1] as any;
      this.metrics.LCP = {
        name: 'LCP',
        value: lcp.startTime,
        rating: lcp.startTime <= 2500 ? 'good' : lcp.startTime <= 4000 ? 'needs-improvement' : 'poor',
        timestamp: Date.now()
      };
      this.reportMetric(this.metrics.LCP);
    });

    // FID - First Input Delay
    this.observeMetric('first-input', (entries) => {
      const fid = entries[0] as any;
      this.metrics.FID = {
        name: 'FID',
        value: fid.processingStart - fid.startTime,
        rating: fid.processingStart - fid.startTime <= 100 ? 'good' : 
               fid.processingStart - fid.startTime <= 300 ? 'needs-improvement' : 'poor',
        timestamp: Date.now()
      };
      this.reportMetric(this.metrics.FID);
    });

    // CLS - Cumulative Layout Shift
    this.observeMetric('layout-shift', (entries) => {
      let clsScore = 0;
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsScore += entry.value;
        }
      });
      
      this.metrics.CLS = {
        name: 'CLS',
        value: clsScore,
        rating: clsScore <= 0.1 ? 'good' : clsScore <= 0.25 ? 'needs-improvement' : 'poor',
        timestamp: Date.now()
      };
      this.reportMetric(this.metrics.CLS);
    });

    // Additional metrics
    this.observeNavigation();
  }

  private initializeApiTracking() {
    // Track API response times
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const startTime = performance.now();
      const response = await originalFetch(...args);
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      const url = typeof args[0] === 'string' ? args[0] : args[0].url;
      this.trackApiCall(url, duration);
      
      return response;
    };
  }

  private observeMetric(type: string, callback: (entries: PerformanceEntry[]) => void) {
    try {
      const observer = new PerformanceObserver((list) => {
        callback(list.getEntries());
      });
      observer.observe({ entryTypes: [type] });
      this.observers.set(type, observer);
    } catch (e) {
      console.warn(`Performance observer not supported: ${type}`);
    }
  }

  private observeNavigation() {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          this.metrics.FCP = {
            name: 'FCP',
            value: entry.firstContentfulPaint,
            rating: entry.firstContentfulPaint <= 1800 ? 'good' : 
                   entry.firstContentfulPaint <= 3000 ? 'needs-improvement' : 'poor',
            timestamp: Date.now()
          };
          
          this.metrics.TTFB = {
            name: 'TTFB',
            value: entry.responseStart - entry.requestStart,
            rating: entry.responseStart - entry.requestStart <= 800 ? 'good' : 
                   entry.responseStart - entry.requestStart <= 1800 ? 'needs-improvement' : 'poor',
            timestamp: Date.now()
          };
        });
      });
      observer.observe({ entryTypes: ['navigation'] });
    } catch (e) {
      console.warn('Navigation timing not supported');
    }
  }

  private trackApiCall(url: string, duration: number) {
    const endpoint = this.getEndpointFromUrl(url);
    
    if (!this.apiMetrics.has(endpoint)) {
      this.apiMetrics.set(endpoint, []);
    }
    
    const metrics = this.apiMetrics.get(endpoint)!;
    metrics.push(duration);
    
    // Keep only last 100 measurements
    if (metrics.length > 100) {
      metrics.shift();
    }
    
    this.reportApiMetric(endpoint, duration);
  }

  private getEndpointFromUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.pathname.replace(/\/\d+/g, '/:id'); // Normalize IDs
    } catch {
      return url;
    }
  }

  private reportMetric(metric: PerformanceMetric) {
    // Send to analytics service or log
    console.log(`📊 ${metric.name}: ${metric.value.toFixed(2)}ms (${metric.rating})`);
    
    // Send to NOX monitoring endpoint
    this.sendToMonitoring('web-vitals', metric);
  }

  private reportApiMetric(endpoint: string, duration: number) {
    const metrics = this.apiMetrics.get(endpoint)!;
    const avg = metrics.reduce((a, b) => a + b, 0) / metrics.length;
    
    console.log(`🚀 API ${endpoint}: ${duration.toFixed(2)}ms (avg: ${avg.toFixed(2)}ms)`);
    
    this.sendToMonitoring('api-performance', {
      endpoint,
      duration,
      average: avg,
      timestamp: Date.now()
    });
  }

  private async sendToMonitoring(type: string, data: any) {
    // Only send in production and if endpoint is available
    if (process.env.NODE_ENV !== 'production') return;
    
    try {
      await fetch('/api/monitoring/metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, data })
      });
    } catch (e) {
      // Silently fail - don't impact user experience
    }
  }

  // Public API
  getMetrics(): WebVitalsMetrics {
    return { ...this.metrics };
  }

  getApiMetrics(): Map<string, number[]> {
    return new Map(this.apiMetrics);
  }

  getAverageApiTime(endpoint?: string): number {
    if (endpoint) {
      const metrics = this.apiMetrics.get(endpoint);
      if (!metrics || metrics.length === 0) return 0;
      return metrics.reduce((a, b) => a + b, 0) / metrics.length;
    }
    
    // Overall average
    let total = 0;
    let count = 0;
    this.apiMetrics.forEach((metrics) => {
      total += metrics.reduce((a, b) => a + b, 0);
      count += metrics.length;
    });
    
    return count > 0 ? total / count : 0;
  }

  disconnect() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
  }
}

// React hook for performance monitoring
import { useEffect, useState } from 'react';

export function usePerformanceMonitor() {
  const [monitor] = useState(() => new PerformanceMonitor());
  const [metrics, setMetrics] = useState<WebVitalsMetrics>({});

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(monitor.getMetrics());
    }, 1000);

    return () => {
      clearInterval(interval);
      monitor.disconnect();
    };
  }, [monitor]);

  return {
    metrics,
    apiMetrics: monitor.getApiMetrics(),
    averageApiTime: monitor.getAverageApiTime()
  };
}

// Performance-optimized component wrapper
import React from 'react';

export function withPerformanceTracking<T extends {}>(
  WrappedComponent: React.ComponentType<T>,
  componentName: string
) {
  return function PerformanceTrackedComponent(props: T) {
    useEffect(() => {
      const startTime = performance.now();
      
      return () => {
        const endTime = performance.now();
        console.log(`⏱️ ${componentName} render time: ${(endTime - startTime).toFixed(2)}ms`);
      };
    });

    return React.createElement(WrappedComponent, props);
  };
}

export default PerformanceMonitor;
