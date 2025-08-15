/**
 * NOX API TypeScript SDK v8.0.0
 * 
 * Official SDK for NOX API with AI-enhanced features, multi-node support,
 * and seamless integration with IAM 2.0 authentication system.
 * 
 * Compatible with CONNECTING_NOX_IAM.md integration strategy using
 * GitHub Packages for distribution and versioned API contracts.
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import WebSocket from 'ws';

// Types for API integration
export interface NoxConfig {
  apiUrl: string;
  token?: string;
  timeout?: number;
  retryAttempts?: number;
  enableWebSocket?: boolean;
  wsUrl?: string;
}

export interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  message?: string;
  timestamp: string;
  requestId: string;
}

export interface NodeStatus {
  id: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  load: number;
  lastSeen: string;
  version: string;
}

export interface AuthToken {
  token: string;
  expiresIn: number;
  refreshToken?: string;
  scope: string[];
}

export interface AIAnalysisResult {
  confidence: number;
  result: Record<string, unknown>;
  recommendations: string[];
  timestamp: string;
  processingTime: number;
}

export interface MetricsData {
  cpu: number;
  memory: number;
  requests: number;
  errors: number;
  responseTime: number;
  timestamp: string;
}

export interface WebSocketMessage {
  type: 'status' | 'metrics' | 'alert' | 'ai_result';
  data: Record<string, unknown>;
  timestamp: string;
}

export interface JobResult {
  jobId: string;
  status: string;
  result?: Record<string, unknown>;
  error?: string;
}

export type EventCallback = (data: unknown) => void;
export type RequestData = Record<string, unknown> | FormData | string | null;
export type PredictionResult = Record<string, unknown>;

// Enhanced AxiosRequestConfig with metadata
interface ExtendedAxiosConfig extends AxiosRequestConfig {
  method?: string;
  url?: string;
  metadata?: { startTime: number };
  retry?: number;
}

// Main SDK class
export class NoxClient {
  private http: AxiosInstance;
  private ws?: WebSocket;
  private config: NoxConfig;
  private wsListeners: Map<string, EventCallback[]> = new Map();

  constructor(config: NoxConfig) {
    this.config = {
      timeout: 10000,
      retryAttempts: 3,
      enableWebSocket: false,
      ...config
    };

    // Initialize HTTP client with optimized settings
    this.http = axios.create({
      baseURL: this.config.apiUrl,
      timeout: this.config.timeout,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'NOX-SDK-TypeScript/8.0.0',
        ...(this.config.token && { 'Authorization': `Bearer ${this.config.token}` })
      }
    });

    // Add request interceptor for retry logic
    this.http.interceptors.request.use(
      (config: ExtendedAxiosConfig) => {
        if (!config.metadata) {
          config.metadata = { startTime: Date.now() };
        }
        return config;
      }
    );

    // Add response interceptor for metrics and error handling
    this.http.interceptors.response.use(
      (response: AxiosResponse) => {
        const config = response.config as ExtendedAxiosConfig;
        const duration = Date.now() - (config.metadata?.startTime ?? Date.now());
        console.log(`📊 ${config.method?.toUpperCase()} ${config.url} - ${response.status} (${duration}ms)`);
        return response;
      },
      async (error: { config: ExtendedAxiosConfig; response?: AxiosResponse }) => {
        const config = error.config;
        if (!config || config.retry === undefined) {
          config.retry = 0;
        }

        if (config.retry < (this.config.retryAttempts ?? 3)) {
          config.retry++;
          console.log(`🔄 Retrying request (${config.retry}/${this.config.retryAttempts})`);
          await this.delay(Math.pow(2, config.retry) * 1000);
          return this.http(config);
        }

        return Promise.reject(error);
      }
    );

    // Initialize WebSocket if enabled
    if (this.config.enableWebSocket && this.config.wsUrl) {
      this.initializeWebSocket();
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private initializeWebSocket(): void {
    if (!this.config.wsUrl) return;

    this.ws = new WebSocket(this.config.wsUrl, {
      headers: this.config.token ? { 'Authorization': `Bearer ${this.config.token}` } : {}
    });

    this.ws.on('open', () => {
      console.log('🔌 WebSocket connected');
      this.emit('ws:connected', null);
    });

    this.ws.on('message', (data: Buffer) => {
      try {
        const message: WebSocketMessage = JSON.parse(data.toString());
        this.emit(`ws:${message.type}`, message.data);
        this.emit('ws:message', message);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    });

    this.ws.on('close', () => {
      console.log('🔌 WebSocket disconnected');
      this.emit('ws:disconnected', null);
    });

    this.ws.on('error', (error: Error) => {
      console.error('WebSocket error:', error);
      this.emit('ws:error', error);
    });
  }

  // Event system for WebSocket messages
  on(event: string, callback: EventCallback): void {
    if (!this.wsListeners.has(event)) {
      this.wsListeners.set(event, []);
    }
    this.wsListeners.get(event)!.push(callback);
  }

  off(event: string, callback?: EventCallback): void {
    if (!callback) {
      this.wsListeners.delete(event);
      return;
    }
    
    const listeners = this.wsListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private emit(event: string, data: unknown): void {
    const listeners = this.wsListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => callback(data));
    }
  }

  // Core HTTP methods with proper TypeScript typing
  async get<T = unknown>(path: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.http.get(path, config);
    return this.formatResponse<T>(response);
  }

  async post<T = unknown>(path: string, data?: RequestData, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.http.post(path, data, config);
    return this.formatResponse<T>(response);
  }

  async put<T = unknown>(path: string, data?: RequestData, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.http.put(path, data, config);
    return this.formatResponse<T>(response);
  }

  async delete<T = unknown>(path: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.http.delete(path, config);
    return this.formatResponse<T>(response);
  }

  async patch<T = unknown>(path: string, data?: RequestData, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.http.patch(path, data, config);
    return this.formatResponse<T>(response);
  }

  private formatResponse<T>(response: AxiosResponse): ApiResponse<T> {
    return {
      data: response.data as T,
      status: response.status,
      message: response.data?.message,
      timestamp: new Date().toISOString(),
      requestId: response.headers['x-request-id'] || 'unknown'
    };
  }

  // Authentication methods (IAM 2.0 integration)
  async login(credentials: { username: string; password: string }): Promise<AuthToken> {
    const response = await this.post<AuthToken>('/auth/login', credentials);
    
    if (response.data.token) {
      this.setToken(response.data.token);
    }
    
    return response.data;
  }

  async refreshToken(refreshToken: string): Promise<AuthToken> {
    const response = await this.post<AuthToken>('/auth/refresh', { refreshToken });
    
    if (response.data.token) {
      this.setToken(response.data.token);
    }
    
    return response.data;
  }

  async logout(): Promise<void> {
    await this.post('/auth/logout');
    this.setToken('');
  }

  setToken(token: string): void {
    this.config.token = token;
    if (token) {
      this.http.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.http.defaults.headers.common['Authorization'];
    }
  }

  // Health and monitoring methods
  async getHealth(): Promise<{ status: string; timestamp: string; version: string }> {
    const response = await this.get<{ status: string; timestamp: string; version: string }>('/health');
    return response.data;
  }

  async getNodes(): Promise<NodeStatus[]> {
    const response = await this.get<{ nodes: NodeStatus[] }>('/nodes');
    return response.data.nodes;
  }

  async getMetrics(): Promise<MetricsData> {
    const response = await this.get<MetricsData>('/metrics');
    return response.data;
  }

  // AI-enhanced methods
  async aiAnalyze(data: Record<string, unknown>, options?: { model?: string; confidence?: number }): Promise<AIAnalysisResult> {
    const response = await this.post<AIAnalysisResult>('/ai/analyze', { data, ...options });
    return response.data;
  }

  async aiPredict(input: Record<string, unknown>, modelId: string): Promise<PredictionResult> {
    const response = await this.post<PredictionResult>(`/ai/predict/${modelId}`, { input });
    return response.data;
  }

  // Streaming methods for real-time data
  streamMetrics(callback: (data: MetricsData) => void): () => void {
    if (!this.ws) {
      throw new Error('WebSocket not enabled. Set enableWebSocket: true and provide wsUrl in config.');
    }

    const metricsCallback: EventCallback = (data: unknown) => callback(data as MetricsData);
    this.on('ws:metrics', metricsCallback);
    
    // Send subscription message
    this.ws.send(JSON.stringify({
      type: 'subscribe',
      channel: 'metrics'
    }));

    // Return unsubscribe function
    return () => {
      this.off('ws:metrics', metricsCallback);
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({
          type: 'unsubscribe',
          channel: 'metrics'
        }));
      }
    };
  }

  // Job queue integration (for future IAM job processing)
  async submitJob(jobType: string, payload: Record<string, unknown>): Promise<{ jobId: string; status: string }> {
    const response = await this.post<{ jobId: string; status: string }>('/jobs', { type: jobType, payload });
    return response.data;
  }

  async getJobStatus(jobId: string): Promise<JobResult> {
    const response = await this.get<JobResult>(`/jobs/${jobId}`);
    return response.data;
  }

  // Connection management
  async testConnection(): Promise<boolean> {
    try {
      await this.getHealth();
      return true;
    } catch {
      return false;
    }
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = undefined;
    }
    this.wsListeners.clear();
  }

  // SDK information
  static getVersion(): string {
    return '8.0.0';
  }

  getConfig(): NoxConfig {
    return { ...this.config };
  }
}

// Convenience exports for common use cases
export const createNoxClient = (config: NoxConfig): NoxClient => new NoxClient(config);

export default NoxClient;
