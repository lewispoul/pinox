/**
 * Nox API TypeScript SDK - AI Security Client
 * v8.0.0 Developer Experience Enhancement
 *
 * AI-powered security features integration for threat detection,
 * behavioral analysis, and intelligent security monitoring.
 */

export interface SecurityEvent {
  eventType: string;
  timestamp?: string;
  method?: string;
  endpoint?: string;
  statusCode?: number;
  responseTime?: number;
  userAgent?: string;
  ipAddress?: string;
  additionalContext?: Record<string, any>;
}

export interface ThreatAssessment {
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
  confidenceScore: number;
  threatIndicators: string[];
  recommendedActions: string[];
  analysisTimeMs: number;
}

export interface SecurityAnalysisOptions {
  includeUserBehavior?: boolean;
  analysisDepth?: 'basic' | 'detailed' | 'comprehensive';
  timeout?: number;
}

/**
 * AI Security client for threat detection and behavioral analysis
 */
export class SecurityClient {
  constructor(private mainClient: any) {}

  /**
   * Analyze a security event for threats
   */
  async analyzeSecurityEvent(
    eventData: SecurityEvent,
    options: SecurityAnalysisOptions = {}
  ): Promise<ThreatAssessment | null> {
    try {
      const securityEvent: SecurityEvent = {
        ...eventData,
        eventType: eventData.eventType || 'api_call',
        timestamp: eventData.timestamp || new Date().toISOString(),
      };

      const response = await this.mainClient.post('/api/ai/security/analyze', {
        ...securityEvent,
        options,
      });

      if (response.success && response.data) {
        return {
          threatLevel: response.data.threat_level || 'low',
          confidenceScore: response.data.confidence_score || 0.0,
          threatIndicators: response.data.threat_indicators || [],
          recommendedActions: response.data.recommended_actions || [],
          analysisTimeMs: response.responseTimeMs || 0.0,
        };
      }

      return null;
    } catch (error) {
      console.error('Security event analysis failed:', error);
      return null;
    }
  }

  /**
   * Analyze an API call for security threats
   */
  async analyzeApiCall(callData: Record<string, any>): Promise<ThreatAssessment | null> {
    const enhancedData: SecurityEvent = {
      ...callData,
      eventType: 'api_call',
    };

    return this.analyzeSecurityEvent(enhancedData);
  }

  /**
   * Get user behavioral profile
   */
  async getUserBehaviorProfile(userId: string): Promise<Record<string, any> | null> {
    try {
      const response = await this.mainClient.get(`/api/ai/security/profile/${userId}`);
      return response.success ? response.data : null;
    } catch (error) {
      console.error('Failed to get user behavior profile:', error);
      return null;
    }
  }

  /**
   * Report suspicious activity
   */
  async reportSuspiciousActivity(
    activityData: Record<string, any>,
    severity: 'low' | 'medium' | 'high' | 'critical' = 'medium'
  ): Promise<boolean> {
    try {
      const reportData = {
        activity: activityData,
        severity,
        timestamp: new Date().toISOString(),
        reporter: 'typescript_sdk',
      };

      const response = await this.mainClient.post('/api/ai/security/report', reportData);
      return response.success;
    } catch (error) {
      console.error('Error reporting suspicious activity:', error);
      return false;
    }
  }

  /**
   * Get current threat intelligence
   */
  async getThreatIntelligence(): Promise<Record<string, any> | null> {
    try {
      const response = await this.mainClient.get('/api/ai/security/intelligence');
      return response.success ? response.data : null;
    } catch (error) {
      console.error('Failed to get threat intelligence:', error);
      return null;
    }
  }

  /**
   * Check IP address reputation
   */
  async checkIpReputation(ipAddress: string): Promise<Record<string, any> | null> {
    try {
      const response = await this.mainClient.get('/api/ai/security/ip-reputation', {
        ip: ipAddress,
      });
      return response.success ? response.data : null;
    } catch (error) {
      console.error('Failed to check IP reputation:', error);
      return null;
    }
  }

  /**
   * Start behavioral monitoring session
   */
  async startBehavioralMonitoring(
    userId: string,
    monitoringDuration: number = 3600
  ): Promise<string | null> {
    try {
      const monitoringData = {
        user_id: userId,
        duration: monitoringDuration,
        monitoring_type: 'behavioral_analysis',
      };

      const response = await this.mainClient.post('/api/ai/security/monitor/start', monitoringData);

      if (response.success && response.data) {
        return response.data.session_id;
      }

      return null;
    } catch (error) {
      console.error('Failed to start behavioral monitoring:', error);
      return null;
    }
  }

  /**
   * Stop behavioral monitoring session
   */
  async stopBehavioralMonitoring(sessionId: string): Promise<Record<string, any> | null> {
    try {
      const response = await this.mainClient.post(`/api/ai/security/monitor/stop/${sessionId}`);
      return response.success ? response.data : null;
    } catch (error) {
      console.error('Failed to stop behavioral monitoring:', error);
      return null;
    }
  }

  /**
   * Get AI-powered security recommendations
   */
  async getSecurityRecommendations(
    userId: string,
    context: Record<string, any> = {}
  ): Promise<Array<Record<string, any>>> {
    try {
      const requestData = {
        user_id: userId,
        context,
      };

      const response = await this.mainClient.post('/api/ai/security/recommendations', requestData);

      if (response.success && response.data) {
        return response.data.recommendations || [];
      }

      return [];
    } catch (error) {
      console.error('Failed to get security recommendations:', error);
      return [];
    }
  }

  /**
   * Configure security settings
   */
  async configureSecuritySettings(settings: Record<string, any>): Promise<boolean> {
    try {
      const response = await this.mainClient.put('/api/ai/security/settings', settings);
      return response.success;
    } catch (error) {
      console.error('Error configuring security settings:', error);
      return false;
    }
  }

  /**
   * Get security system metrics
   */
  async getSecurityMetrics(): Promise<Record<string, any> | null> {
    try {
      const response = await this.mainClient.get('/api/ai/security/metrics');
      return response.success ? response.data : null;
    } catch (error) {
      console.error('Failed to get security metrics:', error);
      return null;
    }
  }
}
