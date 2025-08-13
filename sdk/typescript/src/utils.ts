/**
 * Nox API TypeScript SDK - Utilities
 * v8.0.0 Developer Experience Enhancement
 *
 * Common utilities and helper functions for the Nox SDK including
 * error handling, data validation, formatting, and development tools.
 */

import type { APIError, FilterOptions, SortOptions, TimeRange } from './models';

// === Error Utilities ===

export class NoxError extends Error {
  public readonly code: string;
  public readonly details?: Record<string, any>;
  public readonly timestamp: string;
  public readonly requestId?: string;
  public readonly suggestions?: string[];

  constructor(message: string, code: string, details?: Record<string, any>, requestId?: string) {
    super(message);
    this.name = 'NoxError';
    this.code = code;
    this.details = details;
    this.timestamp = new Date().toISOString();
    this.requestId = requestId;
    
    // Add intelligent error suggestions
    this.suggestions = this.generateSuggestions();
    
    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NoxError);
    }
  }

  private generateSuggestions(): string[] {
    const suggestions: string[] = [];
    
    switch (this.code) {
      case 'AUTHENTICATION_FAILED':
        suggestions.push('Check your API key or authentication credentials');
        suggestions.push('Verify that your token has not expired');
        break;
      case 'RATE_LIMIT_EXCEEDED':
        suggestions.push('Implement exponential backoff retry logic');
        suggestions.push('Consider upgrading your API plan for higher limits');
        break;
      case 'NETWORK_ERROR':
        suggestions.push('Check your network connection');
        suggestions.push('Verify the API endpoint URL is correct');
        break;
      case 'VALIDATION_ERROR':
        suggestions.push('Review the API documentation for required fields');
        suggestions.push('Check data types and format requirements');
        break;
      default:
        suggestions.push('Check the API documentation for more details');
    }
    
    return suggestions;
  }

  public toJSON(): APIError {
    return {
      code: this.code,
      message: this.message,
      details: this.details,
      timestamp: this.timestamp,
      requestId: this.requestId,
      suggestions: this.suggestions,
    };
  }
}

export function createErrorFromResponse(response: any, requestId?: string): NoxError {
  const code = response.error_code || response.code || 'UNKNOWN_ERROR';
  const message = response.error_message || response.message || 'An unknown error occurred';
  const details = response.details || response.data;
  
  return new NoxError(message, code, details, requestId);
}

// === Validation Utilities ===

export function validateRequired(value: any, fieldName: string): void {
  if (value === null || value === undefined || value === '') {
    throw new NoxError(`${fieldName} is required`, 'VALIDATION_ERROR');
  }
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function validateDateRange(start: string, end: string): boolean {
  const startDate = new Date(start);
  const endDate = new Date(end);
  return startDate < endDate && !isNaN(startDate.getTime()) && !isNaN(endDate.getTime());
}

export function validateApiKey(apiKey: string): boolean {
  // Basic API key format validation
  return typeof apiKey === 'string' && apiKey.length >= 32;
}

// === Formatting Utilities ===

export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function formatDuration(milliseconds: number): string {
  if (milliseconds < 1000) {
    return `${milliseconds}ms`;
  } else if (milliseconds < 60000) {
    return `${(milliseconds / 1000).toFixed(1)}s`;
  } else if (milliseconds < 3600000) {
    return `${(milliseconds / 60000).toFixed(1)}m`;
  } else {
    return `${(milliseconds / 3600000).toFixed(1)}h`;
  }
}

export function formatPercentage(value: number, total: number, decimals: number = 1): string {
  const percentage = (value / total) * 100;
  return `${percentage.toFixed(decimals)}%`;
}

export function formatTimestamp(timestamp: string, options?: Intl.DateTimeFormatOptions): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short',
  };
  
  return new Date(timestamp).toLocaleString('en-US', { ...defaultOptions, ...options });
}

// === Data Transformation Utilities ===

export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T;
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as T;
  }
  
  if (typeof obj === 'object') {
    const cloned = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = deepClone(obj[key]);
      }
    }
    return cloned;
  }
  
  return obj;
}

export function mergeDeep<T>(target: T, ...sources: Partial<T>[]): T {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return mergeDeep(target, ...sources);
}

function isObject(item: any): boolean {
  return item && typeof item === 'object' && !Array.isArray(item);
}

export function omit<T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const result = { ...obj };
  keys.forEach(key => delete result[key]);
  return result;
}

export function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;
  keys.forEach(key => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
}

// === Query Building Utilities ===

export function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      if (Array.isArray(value)) {
        value.forEach(v => searchParams.append(key, String(v)));
      } else {
        searchParams.set(key, String(value));
      }
    }
  });
  
  return searchParams.toString();
}

export function buildFilterQuery(filters: FilterOptions[]): Record<string, any> {
  const filterQuery: Record<string, any> = {};
  
  filters.forEach(filter => {
    const key = `${filter.field}__${filter.operator}`;
    filterQuery[key] = filter.value;
  });
  
  return filterQuery;
}

export function buildSortQuery(sorts: SortOptions[]): string {
  return sorts
    .map(sort => `${sort.direction === 'desc' ? '-' : ''}${sort.field}`)
    .join(',');
}

// === Time and Date Utilities ===

export function createTimeRange(duration: string, endTime?: string): TimeRange {
  const end = endTime ? new Date(endTime) : new Date();
  const start = new Date(end);
  
  const durationMatch = duration.match(/^(\d+)([hmsdw])$/);
  if (!durationMatch) {
    throw new NoxError('Invalid duration format. Use format like: 1h, 30m, 7d', 'VALIDATION_ERROR');
  }
  
  const [, amount, unit] = durationMatch;
  const amountNum = parseInt(amount, 10);
  
  switch (unit) {
    case 's':
      start.setSeconds(start.getSeconds() - amountNum);
      break;
    case 'm':
      start.setMinutes(start.getMinutes() - amountNum);
      break;
    case 'h':
      start.setHours(start.getHours() - amountNum);
      break;
    case 'd':
      start.setDate(start.getDate() - amountNum);
      break;
    case 'w':
      start.setDate(start.getDate() - (amountNum * 7));
      break;
  }
  
  return {
    start: start.toISOString(),
    end: end.toISOString(),
  };
}

export function isTimeRangeValid(timeRange: TimeRange): boolean {
  return validateDateRange(timeRange.start, timeRange.end);
}

// === Retry and Backoff Utilities ===

export function calculateBackoffDelay(attempt: number, baseDelay: number, maxDelay: number, strategy: 'linear' | 'exponential' = 'exponential'): number {
  let delay: number;
  
  if (strategy === 'linear') {
    delay = baseDelay * attempt;
  } else {
    delay = baseDelay * Math.pow(2, attempt - 1);
  }
  
  // Add jitter to prevent thundering herd
  const jitter = Math.random() * 0.1 * delay;
  delay += jitter;
  
  return Math.min(delay, maxDelay);
}

export async function withRetry<T>(
  operation: () => Promise<T>,
  maxAttempts: number = 3,
  baseDelay: number = 1000,
  maxDelay: number = 10000,
  strategy: 'linear' | 'exponential' = 'exponential'
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxAttempts) {
        throw lastError;
      }
      
      const delay = calculateBackoffDelay(attempt, baseDelay, maxDelay, strategy);
      await sleep(delay);
    }
  }
  
  throw lastError!;
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// === Development and Debugging Utilities ===

export function createDebugger(namespace: string) {
  const isDebugEnabled = typeof process !== 'undefined' 
    ? process.env.DEBUG?.includes(namespace) || process.env.DEBUG?.includes('*')
    : typeof localStorage !== 'undefined' && localStorage.getItem('debug')?.includes(namespace);

  return function debug(message: string, ...args: any[]) {
    if (isDebugEnabled) {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] ${namespace}: ${message}`, ...args);
    }
  };
}

export function measurePerformance<T>(
  operation: () => Promise<T>,
  operationName: string
): Promise<{ result: T; duration: number }> {
  return new Promise(async (resolve, reject) => {
    const startTime = performance.now();
    
    try {
      const result = await operation();
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      resolve({ result, duration });
    } catch (error) {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      console.error(`Operation "${operationName}" failed after ${duration.toFixed(2)}ms:`, error);
      reject(error);
    }
  });
}

export function generateRequestId(): string {
  return 'req_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now().toString(36);
}

export function sanitizeForLogging(obj: any, sensitiveFields: string[] = ['password', 'token', 'key', 'secret']): any {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }
  
  const sanitized = deepClone(obj);
  
  function sanitizeRecursive(target: any): any {
    if (Array.isArray(target)) {
      return target.map(sanitizeRecursive);
    }
    
    if (typeof target === 'object' && target !== null) {
      const result: any = {};
      for (const [key, value] of Object.entries(target)) {
        if (sensitiveFields.some(field => key.toLowerCase().includes(field.toLowerCase()))) {
          result[key] = '[REDACTED]';
        } else {
          result[key] = sanitizeRecursive(value);
        }
      }
      return result;
    }
    
    return target;
  }
  
  return sanitizeRecursive(sanitized);
}

// === Configuration Utilities ===

export function loadConfigFromEnvironment(prefix: string = 'NOX_'): Record<string, string> {
  const config: Record<string, string> = {};
  
  if (typeof process !== 'undefined' && process.env) {
    Object.entries(process.env).forEach(([key, value]) => {
      if (key.startsWith(prefix) && value !== undefined) {
        const configKey = key.slice(prefix.length).toLowerCase();
        config[configKey] = value;
      }
    });
  }
  
  return config;
}

export function validateConfig(config: Record<string, any>, requiredKeys: string[]): void {
  const missing = requiredKeys.filter(key => !config[key]);
  
  if (missing.length > 0) {
    throw new NoxError(
      `Missing required configuration: ${missing.join(', ')}`,
      'CONFIG_ERROR',
      { missingKeys: missing }
    );
  }
}

// === Export All Utilities ===

export default {
  NoxError,
  createErrorFromResponse,
  validateRequired,
  validateEmail,
  validateUrl,
  validateDateRange,
  validateApiKey,
  formatBytes,
  formatDuration,
  formatPercentage,
  formatTimestamp,
  deepClone,
  mergeDeep,
  omit,
  pick,
  buildQueryString,
  buildFilterQuery,
  buildSortQuery,
  createTimeRange,
  isTimeRangeValid,
  calculateBackoffDelay,
  withRetry,
  sleep,
  createDebugger,
  measurePerformance,
  generateRequestId,
  sanitizeForLogging,
  loadConfigFromEnvironment,
  validateConfig,
};
