/**
 * Nox API TypeScript SDK - Models and Type Definitions
 * v8.0.0 Developer Experience Enhancement
 *
 * Comprehensive type definitions for all Nox API components including
 * authentication, AI, multi-node, and developer experience features.
 */

// === Core API Types ===

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
  requestId?: string;
  responseTimeMs?: number;
  version?: string;
}

export interface APIError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: string;
  requestId?: string;
  suggestions?: string[];
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// === Authentication Types ===

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  role: string;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  metadata?: Record<string, any>;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
  scope?: string;
}

export interface OAuth2Config {
  clientId: string;
  clientSecret?: string;
  redirectUri: string;
  scope?: string[];
  state?: string;
  codeChallenge?: string;
  codeChallengeMethod?: string;
}

export enum AuthenticationMethod {
  PASSWORD = 'password',
  API_KEY = 'api_key',
  OAUTH2 = 'oauth2',
  JWT = 'jwt',
  BIOMETRIC = 'biometric',
  MFA = 'mfa',
}

// === Multi-node and Distributed System Types ===

export interface NodeStatus {
  nodeId: string;
  status: 'online' | 'offline' | 'degraded';
  version: string;
  load: number;
  memory: number;
  connections: number;
  lastHeartbeat: string;
  capabilities: string[];
  metadata?: Record<string, any>;
}

export interface ClusterStatus {
  clusterId: string;
  status: 'healthy' | 'degraded' | 'critical';
  totalNodes: number;
  activeNodes: number;
  masterNode: string;
  version: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoadBalancerConfig {
  algorithm: 'round_robin' | 'least_connections' | 'weighted' | 'hash';
  healthCheckInterval: number;
  maxRetries: number;
  timeoutMs: number;
  weights?: Record<string, number>;
}

// === AI and Machine Learning Types ===

export interface AIModel {
  modelId: string;
  name: string;
  type: 'security' | 'policy' | 'biometric' | 'analytics';
  version: string;
  accuracy: number;
  trainingDate: string;
  isActive: boolean;
  parameters?: Record<string, any>;
}

export interface ThreatAssessment {
  threatId: string;
  level: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  sources: string[];
  description: string;
  recommendations: string[];
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface SecurityEvent {
  eventId: string;
  type: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  source: string;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  details: Record<string, any>;
  timestamp: string;
  resolved: boolean;
  resolvedAt?: string;
  resolvedBy?: string;
}

export interface PolicyRule {
  ruleId: string;
  name: string;
  description: string;
  category: string;
  condition: Record<string, any>;
  action: string;
  priority: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}

export interface PolicyEvaluation {
  evaluationId: string;
  ruleId: string;
  result: 'allow' | 'deny' | 'warning';
  confidence: number;
  explanation: string;
  context: Record<string, any>;
  timestamp: string;
  processingTimeMs: number;
}

// === Performance and Analytics Types ===

export interface PerformanceMetrics {
  requestCount: number;
  averageResponseTime: number;
  errorRate: number;
  throughput: number;
  activeConnections: number;
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  timestamp: string;
}

export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'critical';
  uptime: number;
  version: string;
  components: ComponentHealth[];
  lastCheck: string;
  alerts: SystemAlert[];
}

export interface ComponentHealth {
  component: string;
  status: 'healthy' | 'degraded' | 'critical';
  responseTime?: number;
  errorRate?: number;
  lastCheck: string;
  details?: Record<string, any>;
}

export interface SystemAlert {
  alertId: string;
  type: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  component?: string;
  timestamp: string;
  resolved: boolean;
  resolvedAt?: string;
}

// === Developer Experience Types ===

export interface SDKConfig {
  apiUrl: string;
  version: string;
  timeout: number;
  maxRetries: number;
  retryDelay: number;
  enableLogging: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  enableMetrics: boolean;
  enableWebSocket: boolean;
  rateLimitSettings?: RateLimitSettings;
  authConfig?: AuthConfig;
}

export interface RateLimitSettings {
  enabled: boolean;
  requestsPerSecond: number;
  requestsPerMinute: number;
  burstSize: number;
  backoffStrategy: 'linear' | 'exponential';
}

export interface AuthConfig {
  method: AuthenticationMethod;
  apiKey?: string;
  oauth2?: OAuth2Config;
  tokenStorage?: 'memory' | 'localStorage' | 'custom';
  autoRefresh?: boolean;
  refreshThreshold?: number;
}

export interface WebSocketMessage {
  type: string;
  payload: any;
  timestamp: string;
  messageId?: string;
  channel?: string;
}

export interface RequestOptions {
  timeout?: number;
  retries?: number;
  headers?: Record<string, string>;
  params?: Record<string, any>;
  enableRetry?: boolean;
  enableMetrics?: boolean;
}

// === Documentation and API Explorer Types ===

export interface APIEndpoint {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  description: string;
  parameters: APIParameter[];
  requestBody?: APISchema;
  responses: Record<string, APIResponse>;
  examples: APIExample[];
  tags: string[];
  deprecated?: boolean;
  requiresAuth?: boolean;
  rateLimit?: RateLimitInfo;
}

export interface APIParameter {
  name: string;
  in: 'query' | 'path' | 'header' | 'body';
  type: string;
  required: boolean;
  description: string;
  example?: any;
  schema?: APISchema;
}

export interface APISchema {
  type: string;
  properties?: Record<string, APISchema>;
  items?: APISchema;
  required?: string[];
  example?: any;
  description?: string;
  format?: string;
  enum?: any[];
}

export interface APIExample {
  name: string;
  description: string;
  request: {
    headers?: Record<string, string>;
    params?: Record<string, any>;
    body?: any;
  };
  response: {
    status: number;
    headers?: Record<string, string>;
    body: any;
  };
}

export interface RateLimitInfo {
  requests: number;
  window: string;
  burst?: number;
}

// === Testing and Development Types ===

export interface TestScenario {
  scenarioId: string;
  name: string;
  description: string;
  steps: TestStep[];
  expectedOutcome: string;
  category: string;
  tags: string[];
  prerequisites?: string[];
}

export interface TestStep {
  stepId: string;
  description: string;
  method: string;
  endpoint: string;
  payload?: any;
  expectedStatus: number;
  expectedResponse?: any;
  validations: TestValidation[];
}

export interface TestValidation {
  type: 'status' | 'response_time' | 'body' | 'header';
  condition: string;
  expected: any;
  actual?: any;
  passed?: boolean;
}

export interface TestResult {
  testId: string;
  scenarioId: string;
  status: 'passed' | 'failed' | 'skipped';
  startTime: string;
  endTime: string;
  duration: number;
  steps: TestStepResult[];
  summary: TestSummary;
}

export interface TestStepResult {
  stepId: string;
  status: 'passed' | 'failed' | 'skipped';
  responseTime: number;
  validations: TestValidation[];
  error?: string;
}

export interface TestSummary {
  totalTests: number;
  passed: number;
  failed: number;
  skipped: number;
  successRate: number;
  averageResponseTime: number;
}

// === Event and Webhook Types ===

export interface EventSubscription {
  subscriptionId: string;
  eventTypes: string[];
  endpoint: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  filters?: Record<string, any>;
  retryPolicy?: RetryPolicy;
}

export interface RetryPolicy {
  maxRetries: number;
  retryDelay: number;
  backoffStrategy: 'linear' | 'exponential';
  maxDelay: number;
}

export interface WebhookEvent {
  eventId: string;
  type: string;
  timestamp: string;
  data: any;
  source: string;
  version: string;
  retryCount?: number;
}

// === Utility Types ===

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export interface TimeRange {
  start: string;
  end: string;
  timezone?: string;
}

export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

export interface FilterOptions {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'like';
  value: any;
}

// === Export All Types ===

export {
    AuthenticationResult,
    // Re-export enums from biometric.ts
    BiometricType
} from './ai/biometric';

export type {
    AuthenticationResponse, BiometricChallenge,
    // Re-export biometric interfaces
    BiometricTemplate
} from './ai/biometric';

