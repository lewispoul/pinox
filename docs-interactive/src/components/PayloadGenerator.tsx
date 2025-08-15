'use client';

import { useEffect, useState } from 'react';
import { Endpoint, PayloadSuggestion } from '../types/api';

interface PayloadGeneratorProps {
  endpoint: Endpoint;
  suggestions?: PayloadSuggestion[];
  onPayloadGenerated?: (payload: string) => void;
}

export default function PayloadGenerator({ endpoint, suggestions = [], onPayloadGenerated }: PayloadGeneratorProps) {
  const [generatedPayload, setGeneratedPayload] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<PayloadSuggestion | null>(null);
  const [customFields, setCustomFields] = useState<Array<{key: string; value: string; type: string}>>([]);

  const updatePayload = (newPayload: string) => {
    setGeneratedPayload(newPayload);
    onPayloadGenerated?.(newPayload);
  };

  const generateInitialPayload = async () => {
    setIsGenerating(true);
    
    // Simulate payload generation based on endpoint
    const payload = await generateSmartPayload(endpoint);
    updatePayload(JSON.stringify(payload, null, 2));
    setIsGenerating(false);
  };

  useEffect(() => {
    // Auto-generate initial payload
    generateInitialPayload();
  }, [endpoint]); // eslint-disable-line react-hooks/exhaustive-deps

  const applySuggestion = (suggestion: PayloadSuggestion) => {
    setSelectedSuggestion(suggestion);
    
    // Generate payload from suggestion
    let suggestedPayload: Record<string, unknown> = {};
    
    if (suggestion.category === 'payload' && suggestion.suggestion) {
      suggestedPayload = suggestion.suggestion;
    } else {
      // Use current payload as base and apply suggestion
      try {
        suggestedPayload = JSON.parse(generatedPayload || '{}');
        if (suggestion.suggestion) {
          suggestedPayload = { ...suggestedPayload, ...suggestion.suggestion };
        }
      } catch {
        suggestedPayload = suggestion.suggestion || {};
      }
    }
    
    updatePayload(JSON.stringify(suggestedPayload, null, 2));
  };

  const addCustomField = () => {
    setCustomFields([...customFields, { key: '', value: '', type: 'string' }]);
  };

  const updateCustomField = (index: number, field: 'key' | 'value' | 'type', value: string) => {
    const updated = [...customFields];
    updated[index][field] = value;
    setCustomFields(updated);
    
    // Update payload with custom fields
    try {
      const currentPayload = JSON.parse(generatedPayload || '{}');
      const updatedPayload = { ...currentPayload };
      
      customFields.forEach((customField) => {
        if (customField.key && customField.value) {
          let parsedValue: unknown = customField.value;
          
          // Parse value based on type
          switch (customField.type) {
            case 'number':
              parsedValue = parseFloat(customField.value) || 0;
              break;
            case 'boolean':
              parsedValue = customField.value.toLowerCase() === 'true';
              break;
            case 'array':
              try {
                parsedValue = JSON.parse(customField.value);
              } catch {
                parsedValue = customField.value.split(',').map(s => s.trim());
              }
              break;
            case 'object':
              try {
                parsedValue = JSON.parse(customField.value);
              } catch {
                parsedValue = customField.value;
              }
              break;
            default:
              parsedValue = customField.value;
          }
          
          updatedPayload[customField.key] = parsedValue;
        }
      });
      
      updatePayload(JSON.stringify(updatedPayload, null, 2));
    } catch (error) {
      console.error('Error updating payload:', error);
    }
  };

  const removeCustomField = (index: number) => {
    const updated = customFields.filter((_, i) => i !== index);
    setCustomFields(updated);
  };

  const validatePayload = () => {
    try {
      JSON.parse(generatedPayload);
      return { isValid: true, error: null };
    } catch (error) {
      return { isValid: false, error: error instanceof Error ? error.message : 'Invalid JSON' };
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPayload);
    // TODO: Add toast notification
  };

  const { isValid, error } = validatePayload();

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-900">
          💡 Smart Payload Generator
        </h4>
        <div className="flex items-center space-x-2">
          <button
            onClick={generateInitialPayload}
            disabled={isGenerating}
            className="px-3 py-1 text-xs font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded disabled:opacity-50"
          >
            {isGenerating ? 'Generating...' : 'Regenerate'}
          </button>
          <button
            onClick={copyToClipboard}
            className="px-3 py-1 text-xs font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded"
          >
            📋 Copy
          </button>
        </div>
      </div>

      {/* AI Suggestions */}
      {suggestions.length > 0 && (
        <div className="space-y-2">
          <h5 className="text-xs font-medium text-purple-800">🤖 AI Suggestions</h5>
          <div className="grid grid-cols-1 gap-2">
            {suggestions.filter(s => s.category === 'payload').map((suggestion, index) => (
              <div
                key={index}
                className={`p-2 border rounded cursor-pointer transition-colors ${
                  selectedSuggestion === suggestion
                    ? 'border-purple-300 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-200 hover:bg-purple-25'
                }`}
                onClick={() => applySuggestion(suggestion)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs text-purple-700 font-medium">
                      ⭐ {Math.round(suggestion.confidence * 100)}% confidence
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {suggestion.explanation}
                    </p>
                  </div>
                  {selectedSuggestion === suggestion && (
                    <div className="text-purple-600">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Custom Fields */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h5 className="text-xs font-medium text-gray-700">🔧 Custom Fields</h5>
          <button
            onClick={addCustomField}
            className="px-2 py-1 text-xs font-medium text-green-600 hover:text-green-800 hover:bg-green-50 rounded"
          >
            + Add Field
          </button>
        </div>
        
        {customFields.map((field, index) => (
          <div key={index} className="flex items-center space-x-2 p-2 border border-gray-200 rounded">
            <input
              type="text"
              placeholder="Key"
              value={field.key}
              onChange={(e) => updateCustomField(index, 'key', e.target.value)}
              className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <select
              value={field.type}
              onChange={(e) => updateCustomField(index, 'type', e.target.value)}
              className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="string">String</option>
              <option value="number">Number</option>
              <option value="boolean">Boolean</option>
              <option value="array">Array</option>
              <option value="object">Object</option>
            </select>
            <input
              type="text"
              placeholder="Value"
              value={field.value}
              onChange={(e) => updateCustomField(index, 'value', e.target.value)}
              className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              onClick={() => removeCustomField(index)}
              className="px-2 py-1 text-xs font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Generated Payload */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h5 className="text-xs font-medium text-gray-700">📝 Generated Payload</h5>
          <div className="flex items-center space-x-2">
            {isValid ? (
              <span className="text-xs text-green-600">✓ Valid JSON</span>
            ) : (
              <span className="text-xs text-red-600">✗ Invalid JSON</span>
            )}
          </div>
        </div>
        
        <div className="relative">
          <textarea
            value={generatedPayload}
            onChange={(e) => updatePayload(e.target.value)}
            className={`w-full h-32 px-3 py-2 text-xs font-mono border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isValid ? 'border-gray-300' : 'border-red-300'
            }`}
            placeholder="Generated payload will appear here..."
          />
          {error && (
            <div className="absolute top-2 right-2 text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Endpoint Context */}
      <div className="bg-gray-50 border border-gray-200 rounded p-3">
        <h5 className="text-xs font-medium text-gray-700 mb-2">📋 Endpoint Context</h5>
        <div className="space-y-1 text-xs text-gray-600">
          <div><strong>Method:</strong> {endpoint.method}</div>
          <div><strong>Path:</strong> {endpoint.path}</div>
          <div><strong>Auth Required:</strong> {endpoint.requiresAuth ? 'Yes' : 'No'}</div>
          <div><strong>Tags:</strong> {endpoint.tags.join(', ')}</div>
        </div>
      </div>
    </div>
  );
}

// Smart payload generation logic
async function generateSmartPayload(endpoint: Endpoint): Promise<Record<string, unknown>> {
  const { method, path } = endpoint;

  // Authentication endpoints
  if (path.includes('/auth/login') && method === 'POST') {
    return {
      email: 'user@example.com',
      password: 'secure_password_123',
      remember_me: false
    };
  }

  if (path.includes('/auth/register') && method === 'POST') {
    return {
      username: 'new_user',
      email: 'newuser@example.com',
      password: 'secure_password_123',
      confirm_password: 'secure_password_123',
      terms_accepted: true
    };
  }

  // AI endpoints
  if (path.includes('/ai/security/assess') && method === 'POST') {
    return {
      user_id: 'user-123',
      ip_address: '192.168.1.100',
      user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      session_data: {
        login_time: new Date().toISOString(),
        previous_locations: ['US', 'CA'],
        failed_attempts: 0
      },
      context: {
        time_of_day: 'business_hours',
        device_type: 'desktop',
        location_match: true
      }
    };
  }

  if (path.includes('/ai/policy/evaluate') && method === 'POST') {
    return {
      user_id: 'user-123',
      resource: '/api/sensitive-data',
      action: 'read',
      context: {
        time: new Date().toISOString(),
        ip_address: '192.168.1.100',
        user_agent: 'Mozilla/5.0...',
        session_age: 3600
      },
      confidence_threshold: 0.8
    };
  }

  if (path.includes('/ai/biometric') && method === 'POST') {
    return {
      user_id: 'user-123',
      biometric_type: 'face',
      template_data: 'base64_encoded_biometric_template',
      challenge_id: 'challenge-' + Date.now(),
      liveness_required: true,
      confidence_threshold: 0.9
    };
  }

  // Node management endpoints
  if (path.includes('/nodes') && method === 'POST') {
    return {
      node_id: 'node-' + Math.random().toString(36).substr(2, 9),
      hostname: 'worker-01.cluster.local',
      capabilities: ['compute', 'storage', 'ai'],
      resources: {
        cpu_cores: 8,
        memory_gb: 32,
        storage_gb: 1000,
        gpu_count: 1
      },
      location: {
        region: 'us-west-2',
        zone: 'us-west-2a',
        datacenter: 'dc-01'
      },
      tags: ['production', 'high-memory']
    };
  }

  // Policy management
  if (path.includes('/policies') && method === 'POST') {
    return {
      name: 'Example Access Policy',
      description: 'Controls access to sensitive resources',
      rules: [
        {
          condition: 'user.role == "admin"',
          action: 'allow',
          resources: ['*']
        },
        {
          condition: 'user.department == "engineering"',
          action: 'allow',
          resources: ['/api/dev/*']
        }
      ],
      priority: 100,
      enabled: true
    };
  }

  // Default payloads for other methods
  if (method === 'POST') {
    return {
      data: 'example_value',
      timestamp: new Date().toISOString(),
      metadata: {
        source: 'api_documentation',
        version: '8.0.0'
      }
    };
  }

  if (method === 'PUT' || method === 'PATCH') {
    return {
      id: 'resource-123',
      updated_data: 'new_value',
      timestamp: new Date().toISOString()
    };
  }

  // Default empty object for other cases
  return {};
}
