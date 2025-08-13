/**
 * Nox API TypeScript SDK
 * v8.0.0 Developer Experience Enhancement
 *
 * Complete TypeScript SDK for Nox API with comprehensive AI integration,
 * multi-node support, and enhanced developer experience.
 *
 * @example Basic Usage
 * ```typescript
 * import { NoxClient } from '@nox/sdk';
 * 
 * const client = new NoxClient({
 *   apiUrl: 'https://api.nox.dev',
 *   apiKey: 'your-api-key'
 * });
 * 
 * // Use AI security features
 * const threats = await client.ai.security.assessThreat({
 *   ip: '192.168.1.100',
 *   userAgent: 'Mozilla/5.0...'
 * });
 * ```
 *
 * @example Advanced Configuration
 * ```typescript
 * import { NoxClient, AuthenticationMethod } from '@nox/sdk';
 * 
 * const client = new NoxClient({
 *   apiUrl: 'https://api.nox.dev',
 *   authConfig: {
 *     method: AuthenticationMethod.OAUTH2,
 *     oauth2: {
 *       clientId: 'your-client-id',
 *       redirectUri: 'https://yourapp.com/callback'
 *     }
 *   },
 *   enableWebSocket: true,
 *   enableMetrics: true
 * });
 * ```
 */

// === Internal Imports ===
import { NoxClient as NoxClientClass } from './client';

// === Core Client Exports ===
export { NoxClient } from './client';

// === AI Module Exports ===
export { BiometricClient } from './ai/biometric';
export { PolicyClient } from './ai/policy';
export { SecurityClient } from './ai/security';

export type {
    AuthenticationResponse, BiometricChallenge,
    // Biometric types
    BiometricTemplate
} from './ai/biometric';

export {
    AuthenticationResult,
    // Biometric enums
    BiometricType
} from './ai/biometric';

// === Models and Types Exports ===
export type {

    // AI and ML types
    AIModel,
    // Documentation types
    APIEndpoint, APIError, APIExample, APIParameter,
    // Core API types
    APIResponse, APISchema, AuthConfig,
    // Authentication types
    AuthUser, ClusterStatus, ComponentHealth, DeepPartial,
    // Event types
    EventSubscription, FilterOptions, LoadBalancerConfig,
    // Multi-node types
    NodeStatus,
    // Utility types
    Nullable, OAuth2Config, Optional, PaginatedResponse,
    // Performance types
    PerformanceMetrics, PolicyEvaluation, PolicyRule, RateLimitInfo, RateLimitSettings, RequestOptions, RetryPolicy,
    // Developer Experience types
    SDKConfig, SecurityEvent, SortOptions, SystemAlert, SystemHealth, TestResult,
    // Testing types
    TestScenario,
    TestStep, TestStepResult,
    TestSummary, TestValidation, ThreatAssessment, TimeRange, TokenPair, WebhookEvent, WebSocketMessage
} from './models';

export {
    // Authentication enums
    AuthenticationMethod
} from './models';

// === Utilities Exports ===
export {
    buildFilterQuery,
    // Query building
    buildQueryString, buildSortQuery,
    // Retry utilities
    calculateBackoffDelay,
    // Debug utilities
    createDebugger, createErrorFromResponse,
    // Time utilities
    createTimeRange,
    // Data transformation
    deepClone,
    // Formatting utilities
    formatBytes,
    formatDuration,
    formatPercentage,
    formatTimestamp, generateRequestId, isTimeRangeValid,
    // Config utilities
    loadConfigFromEnvironment, measurePerformance, mergeDeep,
    // Error handling
    NoxError, omit,
    pick, sanitizeForLogging, sleep, validateApiKey, validateConfig, validateDateRange, validateEmail,
    // Validation utilities
    validateRequired, validateUrl, withRetry
} from './utils';

// === Convenience Exports ===

/**
 * Create a new Nox API client with default configuration
 * 
 * @param apiKey - Your Nox API key
 * @param apiUrl - Optional API URL (defaults to production)
 * @returns Configured NoxClient instance
 * 
 * @example
 * ```typescript
 * import { createClient } from '@nox/sdk';
 * 
 * const client = createClient('your-api-key');
 * const health = await client.getHealth();
 * ```
 */
export function createClient(apiKey: string, apiUrl?: string): NoxClientClass {
  return new NoxClientClass({
    baseUrl: apiUrl || 'https://api.nox.dev',
    apiToken: apiKey,
    timeout: 30000,
    retryAttempts: 3,
    retryDelay: 1000,
    enablePerformanceTracking: true,
    enableWebSocket: true,
  });
}

/**
 * Create a client configured for development/testing
 * 
 * @param config - Development configuration options
 * @returns NoxClient configured for development
 * 
 * @example
 * ```typescript
 * import { createDevClient } from '@nox/sdk';
 * 
 * const client = createDevClient({
 *   apiKey: 'dev-api-key',
 *   apiUrl: 'http://localhost:8000'
 * });
 * ```
 */
export function createDevClient(config: {
  apiKey: string;
  apiUrl?: string;
}): NoxClientClass {
  return new NoxClientClass({
    baseUrl: config.apiUrl || 'http://localhost:8000',
    apiToken: config.apiKey,
    timeout: 30000,
    retryAttempts: 5,
    retryDelay: 1000,
    enablePerformanceTracking: true,
    enableWebSocket: true,
    enableAISecurity: true,
  });
}

/**
 * SDK version information
 */
export const VERSION = '8.0.0';
export const SDK_INFO = {
  version: VERSION,
  name: '@nox/typescript-sdk',
  description: 'TypeScript SDK for Nox API v8.0.0',
  features: [
    'Complete AI Integration',
    'Multi-node Support',
    'Real-time WebSocket',
    'Comprehensive Error Handling',
    'Performance Metrics',
    'TypeScript First',
    'Modern Async/Await',
    'Intelligent Retry Logic',
  ],
  documentation: 'https://docs.nox.dev/sdk/typescript',
  repository: 'https://github.com/nox-dev/typescript-sdk',
  support: 'https://support.nox.dev',
} as const;

/**
 * Check if the SDK is compatible with the target API version
 * 
 * @param apiVersion - Target API version
 * @returns Compatibility information
 */
export function checkCompatibility(apiVersion: string): {
  compatible: boolean;
  message: string;
  recommendations?: string[];
} {
  const [major, minor] = apiVersion.split('.').map(Number);
  const [sdkMajor, sdkMinor] = VERSION.split('.').map(Number);
  
  if (major !== sdkMajor) {
    return {
      compatible: false,
      message: `SDK v${VERSION} is not compatible with API v${apiVersion}. Major version mismatch.`,
      recommendations: [
        `Upgrade SDK to v${major}.x.x`,
        'Check migration guide for breaking changes',
        'Consider using API compatibility layer',
      ],
    };
  }
  
  if (minor > sdkMinor) {
    return {
      compatible: true,
      message: `SDK v${VERSION} may have limited support for API v${apiVersion} features.`,
      recommendations: [
        `Consider upgrading SDK to v${major}.${minor}.x`,
        'Some newer API features may not be available',
      ],
    };
  }
  
  return {
    compatible: true,
    message: `SDK v${VERSION} is fully compatible with API v${apiVersion}.`,
  };
}

/**
 * Default export provides the main client class
 */
export default NoxClientClass;

// === Type-only exports for better tree-shaking ===
export type * from './models';
export type * from './utils';

