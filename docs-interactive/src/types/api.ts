// API Types for Documentation System

export interface Endpoint {
  path: string;
  method: string;
  summary: string;
  description: string;
  tags: string[];
  requiresAuth: boolean;
  parameters?: Parameter[];
  requestBody?: RequestBody;
  responses?: { [statusCode: string]: Response };
}

export interface Parameter {
  name: string;
  in: 'query' | 'path' | 'header' | 'cookie';
  required: boolean;
  schema: Schema;
  description?: string;
  example?: unknown;
}

export interface RequestBody {
  required: boolean;
  content: {
    [mediaType: string]: {
      schema: Schema;
      example?: unknown;
    };
  };
}

export interface Response {
  description: string;
  content?: {
    [mediaType: string]: {
      schema: Schema;
      example?: unknown;
    };
  };
}

export interface Schema {
  type: string;
  properties?: { [key: string]: Schema };
  items?: Schema;
  required?: string[];
  example?: unknown;
  description?: string;
}

// OpenAPI Specification Structure
export interface OpenAPISpec {
  openapi: string;
  info: {
    title: string;
    version: string;
    description?: string;
  };
  servers?: Array<{
    url: string;
    description?: string;
  }>;
  paths: {
    [path: string]: {
      [method: string]: {
        tags?: string[];
        summary?: string;
        description?: string;
        parameters?: Parameter[];
        requestBody?: RequestBody;
        responses: { [statusCode: string]: Response };
        security?: Array<{ [key: string]: string[] }>;
      };
    };
  };
  tags?: Array<{
    name: string;
    description: string;
  }>;
  components?: {
    schemas?: { [key: string]: Schema };
    securitySchemes?: { [key: string]: SecurityScheme };
  };
}

export interface SecurityScheme {
  type: string;
  scheme?: string;
  bearerFormat?: string;
  description?: string;
}

// AI Helper Types
export interface PayloadSuggestion {
  confidence: number;
  suggestion: Record<string, unknown>;
  explanation: string;
  category: 'payload' | 'parameters' | 'headers' | 'validation';
}

export interface AIMessage {
  type: 'user' | 'assistant';
  content: string;
  suggestions?: PayloadSuggestion[];
  timestamp: Date;
}

// Live API Explorer Types
export interface APITestRequest {
  endpoint: Endpoint;
  method: string;
  url: string;
  headers: { [key: string]: string };
  body?: Record<string, unknown>;
  queryParams?: { [key: string]: string };
}

export interface APITestResponse {
  status: number;
  statusText: string;
  headers: { [key: string]: string };
  data: unknown;
  duration: number;
  timestamp: Date;
}

export interface APITestResult {
  request: APITestRequest;
  response?: APITestResponse;
  error?: {
    message: string;
    code?: string;
    stack?: string;
  };
  isLoading: boolean;
}
