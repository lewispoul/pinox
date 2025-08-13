/**
 * Nox API TypeScript SDK - Main Client
 * v8.0.0 Developer Experience Enhancement
 *
 * Advanced TypeScript/JavaScript SDK for the Nox API platform with AI capabilities,
 * distributed architecture support, and comprehensive developer tools.
 */

import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { EventEmitter } from 'events';
import WebSocket from 'ws';

// Types and interfaces
export interface NoxClientConfig {
  baseUrl: string;
  apiToken?: string;
  oauthClientId?: string;
  oauthClientSecret?: string;
  timeout?: number;
  retryAttempts?: number;
  retryDelay?: number;
  enableAISecurity?: boolean;
  enablePerformanceTracking?: boolean;
  userAgent?: string;
  rateLimitAware?: boolean;
  enableWebSocket?: boolean;
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: APIError;
  statusCode: number;
  headers: Record<string, string>;
  responseTimeMs: number;
  requestId?: string;
}

export interface APIError {
  code: string;
  message: string;
  details?: string;
  timestamp?: string;
  requestId?: string;
  suggestions?: string[];
  documentationUrl?: string;
}

export enum ExecutionMode {
  SAFE = 'safe',
  NORMAL = 'normal',
  PRIVILEGED = 'privileged',
}

export enum ScriptLanguage {
  PYTHON = 'python',
  BASH = 'bash',
  POWERSHELL = 'powershell',
  JAVASCRIPT = 'javascript',
}

export enum ExecutionStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  TIMEOUT = 'timeout',
}

export interface ExecutionRequest {
  scriptContent?: string;
  scriptId?: string;
  language?: ScriptLanguage;
  mode?: ExecutionMode;
  environment?: Record<string, string>;
  timeout?: number;
  captureOutput?: boolean;
  workingDirectory?: string;
  arguments?: string[];
  metadata?: Record<string, any>;
}

export interface ExecutionResult {
  executionId: string;
  status: ExecutionStatus;
  exitCode?: number;
  stdout?: string;
  stderr?: string;
  executionTime?: number;
  startTime?: string;
  endTime?: string;
  resourceUsage?: Record<string, any>;
  errorDetails?: Record<string, any>;
}

export interface UserProfile {
  userId: string;
  username: string;
  email: string;
  fullName?: string;
  roles: string[];
  permissions: string[];
  createdAt?: string;
  lastLogin?: string;
  profilePicture?: string;
  preferences?: Record<string, any>;
  metadata?: Record<string, any>;
}

export interface PerformanceMetrics {
  requestCount: number;
  averageResponseTime: number;
  errorRate: number;
  rateLimitStatus?: {
    remaining: number;
    resetTime: string;
    limit: number;
  };
  quotaStatus?: {
    used: number;
    limit: number;
    remaining: number;
  };
}

/**
 * Main Nox API client with comprehensive TypeScript support
 */
export class NoxClient extends EventEmitter {
  private readonly config: Required<NoxClientConfig>;
  private readonly httpClient: AxiosInstance;
  private websocket?: WebSocket;
  private tokenInfo?: { accessToken: string; refreshToken?: string; expiresAt?: Date };
  private metrics: PerformanceMetrics;
  private rateLimitState: { remaining: number; resetTime: Date | null } = {
    remaining: Infinity,
    resetTime: null,
  };

  constructor(config: NoxClientConfig) {
    super();

    // Validate required configuration
    if (!config.baseUrl) {
      throw new Error('baseUrl is required');
    }

    // Set default configuration
    this.config = {
      baseUrl: config.baseUrl.replace(/\/$/, ''), // Remove trailing slash
      timeout: 30000,
      retryAttempts: 3,
      retryDelay: 1000,
      enableAISecurity: true,
      enablePerformanceTracking: true,
      userAgent: `Nox-TypeScript-SDK/8.0.0`,
      rateLimitAware: true,
      enableWebSocket: false,
      ...config,
    };

    // Initialize metrics
    this.metrics = {
      requestCount: 0,
      averageResponseTime: 0,
      errorRate: 0,
    };

    // Create HTTP client
    this.httpClient = axios.create({
      baseURL: this.config.baseUrl,
      timeout: this.config.timeout,
      headers: {
        'User-Agent': this.config.userAgent,
        'Content-Type': 'application/json',
      },
    });

    // Setup interceptors
    this.setupInterceptors();

    // Initialize WebSocket if enabled
    if (this.config.enableWebSocket) {
      this.initializeWebSocket();
    }
  }

  /**
   * Setup request/response interceptors
   */
  private setupInterceptors(): void {
    // Request interceptor
    this.httpClient.interceptors.request.use(
      async (config) => {
        const startTime = Date.now();
        config.metadata = { startTime };

        // Add authentication
        if (this.tokenInfo?.accessToken) {
          config.headers = config.headers || {};
          config.headers['Authorization'] = `Bearer ${this.tokenInfo.accessToken}`;
        } else if (this.config.apiToken) {
          config.headers = config.headers || {};
          config.headers['X-API-Token'] = this.config.apiToken;
        }

        // Add request ID
        config.headers = config.headers || {};
        config.headers['X-Request-ID'] = this.generateRequestId();

        // Check rate limits
        if (this.config.rateLimitAware && this.rateLimitState.remaining <= 0) {
          const now = new Date();
          if (this.rateLimitState.resetTime && now < this.rateLimitState.resetTime) {
            const waitTime = this.rateLimitState.resetTime.getTime() - now.getTime();
            this.emit('rateLimitHit', { waitTime });
            await this.delay(waitTime);
          }
        }

        return config;
      },
      (error) => {
        this.emit('requestError', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.httpClient.interceptors.response.use(
      (response) => {
        const endTime = Date.now();
        const startTime = response.config.metadata?.startTime || endTime;
        const responseTime = endTime - startTime;

        // Update metrics
        this.updateMetrics(responseTime, false);

        // Update rate limit state
        this.updateRateLimitState(response.headers);

        // Emit performance event
        if (this.config.enablePerformanceTracking) {
          this.emit('requestComplete', {
            url: response.config.url,
            method: response.config.method,
            statusCode: response.status,
            responseTime,
          });
        }

        return response;
      },
      async (error: AxiosError) => {
        const endTime = Date.now();
        const startTime = error.config?.metadata?.startTime || endTime;
        const responseTime = endTime - startTime;

        // Update metrics
        this.updateMetrics(responseTime, true);

        // Handle token refresh
        if (error.response?.status === 401 && this.tokenInfo?.refreshToken) {
          try {
            await this.refreshToken();
            // Retry original request
            return this.httpClient.request(error.config!);
          } catch (refreshError) {
            this.emit('tokenRefreshFailed', refreshError);
          }
        }

        // Handle rate limiting
        if (error.response?.status === 429) {
          const retryAfter = error.response.headers['retry-after'];
          const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : this.config.retryDelay;
          this.emit('rateLimitExceeded', { waitTime, error });

          if (this.config.retryAttempts > 0) {
            await this.delay(waitTime);
            return this.httpClient.request(error.config!);
          }
        }

        // Emit error event
        this.emit('requestError', {
          url: error.config?.url,
          method: error.config?.method,
          statusCode: error.response?.status,
          responseTime,
          error: error.message,
        });

        return Promise.reject(error);
      }
    );
  }

  /**
   * Initialize WebSocket connection for real-time features
   */
  private initializeWebSocket(): void {
    try {
      const wsUrl = this.config.baseUrl.replace(/^https?/, 'ws') + '/ws';
      this.websocket = new WebSocket(wsUrl);

      this.websocket.on('open', () => {
        this.emit('websocketConnected');
      });

      this.websocket.on('message', (data: Buffer) => {
        try {
          const message = JSON.parse(data.toString());
          this.emit('websocketMessage', message);
        } catch (error) {
          this.emit('websocketError', error);
        }
      });

      this.websocket.on('close', () => {
        this.emit('websocketDisconnected');
        // Auto-reconnect after delay
        setTimeout(() => this.initializeWebSocket(), 5000);
      });

      this.websocket.on('error', (error) => {
        this.emit('websocketError', error);
      });
    } catch (error) {
      this.emit('websocketError', error);
    }
  }

  /**
   * Execute a script
   */
  async executeScript(
    scriptContent: string,
    language: ScriptLanguage,
    options: Partial<ExecutionRequest> = {}
  ): Promise<APIResponse<ExecutionResult>> {
    const request: ExecutionRequest = {
      scriptContent,
      language,
      mode: ExecutionMode.SAFE,
      captureOutput: true,
      timeout: 300,
      ...options,
    };

    return this.post<ExecutionResult>('/api/execute', request);
  }

  /**
   * Get execution result by ID
   */
  async getExecutionResult(executionId: string): Promise<APIResponse<ExecutionResult>> {
    return this.get<ExecutionResult>(`/api/executions/${executionId}`);
  }

  /**
   * Cancel execution
   */
  async cancelExecution(executionId: string): Promise<APIResponse<void>> {
    return this.post<void>(`/api/executions/${executionId}/cancel`);
  }

  /**
   * Get user profile
   */
  async getUserProfile(): Promise<APIResponse<UserProfile>> {
    return this.get<UserProfile>('/api/user/profile');
  }

  /**
   * Get system health status
   */
  async getHealthStatus(): Promise<APIResponse<any>> {
    return this.get('/api/health');
  }

  /**
   * Get performance metrics
   */
  async getSystemMetrics(): Promise<APIResponse<any>> {
    return this.get('/api/metrics');
  }

  /**
   * Start OAuth2 authentication flow
   */
  async startOAuth2Flow(provider: string, scopes?: string[]): Promise<APIResponse<{ authUrl: string }>> {
    const params = scopes ? { scopes: scopes.join(' ') } : {};
    return this.get<{ authUrl: string }>(`/api/auth/${provider}/login`, params);
  }

  /**
   * Handle OAuth2 callback
   */
  async handleOAuth2Callback(provider: string, code: string, state?: string): Promise<APIResponse<any>> {
    return this.post(`/api/auth/${provider}/callback`, { code, state });
  }

  /**
   * Generic GET request
   */
  async get<T = any>(url: string, params?: Record<string, any>): Promise<APIResponse<T>> {
    return this.request<T>('GET', url, undefined, params);
  }

  /**
   * Generic POST request
   */
  async post<T = any>(url: string, data?: any): Promise<APIResponse<T>> {
    return this.request<T>('POST', url, data);
  }

  /**
   * Generic PUT request
   */
  async put<T = any>(url: string, data?: any): Promise<APIResponse<T>> {
    return this.request<T>('PUT', url, data);
  }

  /**
   * Generic DELETE request
   */
  async delete<T = any>(url: string): Promise<APIResponse<T>> {
    return this.request<T>('DELETE', url);
  }

  /**
   * Generic request method
   */
  private async request<T = any>(
    method: string,
    url: string,
    data?: any,
    params?: Record<string, any>
  ): Promise<APIResponse<T>> {
    try {
      const config: AxiosRequestConfig = {
        method: method as any,
        url,
        data,
        params,
      };

      const response: AxiosResponse<T> = await this.httpClient.request(config);

      return {
        success: true,
        data: response.data,
        statusCode: response.status,
        headers: response.headers as Record<string, string>,
        responseTimeMs: Date.now() - (response.config.metadata?.startTime || Date.now()),
        requestId: response.headers['x-request-id'] as string,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const apiError: APIError = {
          code: error.code || 'UNKNOWN_ERROR',
          message: error.message,
          details: error.response?.data?.detail || error.response?.statusText,
          timestamp: new Date().toISOString(),
          requestId: error.response?.headers?.['x-request-id'],
          suggestions: error.response?.data?.suggestions,
          documentationUrl: error.response?.data?.documentation_url,
        };

        return {
          success: false,
          error: apiError,
          statusCode: error.response?.status || 0,
          headers: (error.response?.headers as Record<string, string>) || {},
          responseTimeMs: Date.now() - (error.config?.metadata?.startTime || Date.now()),
          requestId: error.response?.headers?.['x-request-id'],
        };
      }

      throw error;
    }
  }

  /**
   * Refresh OAuth2 token
   */
  private async refreshToken(): Promise<void> {
    if (!this.tokenInfo?.refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await this.post('/api/auth/refresh', {
      refresh_token: this.tokenInfo.refreshToken,
    });

    if (response.success && response.data) {
      this.tokenInfo = {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token || this.tokenInfo.refreshToken,
        expiresAt: new Date(Date.now() + response.data.expires_in * 1000),
      };
    }
  }

  /**
   * Update performance metrics
   */
  private updateMetrics(responseTime: number, isError: boolean): void {
    this.metrics.requestCount++;
    this.metrics.averageResponseTime =
      (this.metrics.averageResponseTime * (this.metrics.requestCount - 1) + responseTime) /
      this.metrics.requestCount;

    if (isError) {
      this.metrics.errorRate =
        (this.metrics.errorRate * (this.metrics.requestCount - 1) + 1) / this.metrics.requestCount;
    } else {
      this.metrics.errorRate =
        (this.metrics.errorRate * (this.metrics.requestCount - 1)) / this.metrics.requestCount;
    }
  }

  /**
   * Update rate limit state from response headers
   */
  private updateRateLimitState(headers: Record<string, string>): void {
    const remaining = parseInt(headers['x-ratelimit-remaining'] || '999999');
    const resetTime = headers['x-ratelimit-reset'];

    this.rateLimitState.remaining = remaining;
    this.rateLimitState.resetTime = resetTime ? new Date(parseInt(resetTime) * 1000) : null;

    this.metrics.rateLimitStatus = {
      remaining,
      resetTime: this.rateLimitState.resetTime?.toISOString() || '',
      limit: parseInt(headers['x-ratelimit-limit'] || '1000'),
    };
  }

  /**
   * Generate unique request ID
   */
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Delay utility
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Get current performance metrics
   */
  getPerformanceMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  /**
   * Close WebSocket connection
   */
  disconnect(): void {
    if (this.websocket) {
      this.websocket.close();
      this.websocket = undefined;
    }
  }

  /**
   * Send message via WebSocket
   */
  sendWebSocketMessage(message: any): void {
    if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
      this.websocket.send(JSON.stringify(message));
    } else {
      this.emit('websocketError', new Error('WebSocket not connected'));
    }
  }
}
