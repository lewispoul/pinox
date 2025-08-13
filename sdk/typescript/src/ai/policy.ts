/**
 * Nox API TypeScript SDK - AI Policy Client
 * v8.0.0 Developer Experience Enhancement
 *
 * AI-powered policy engine integration for intelligent access control,
 * dynamic policy enforcement, and adaptive security policies.
 */

export enum PolicyAction {
  ALLOW = 'allow',
  DENY = 'deny',
  REQUIRE_MFA = 'require_mfa',
  REQUIRE_APPROVAL = 'require_approval',
  LOG_AND_CONTINUE = 'log_and_continue',
  CHALLENGE = 'challenge',
}

export enum PolicyCondition {
  TIME_BASED = 'time_based',
  LOCATION_BASED = 'location_based',
  RISK_BASED = 'risk_based',
  ROLE_BASED = 'role_based',
  BEHAVIORAL = 'behavioral',
  RESOURCE_BASED = 'resource_based',
}

export interface PolicyRule {
  ruleId: string;
  name: string;
  description: string;
  action: PolicyAction;
  conditions: Array<Record<string, any>>;
  priority?: number;
  enabled?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PolicyEvaluation {
  decision: PolicyAction;
  matchedRules: string[];
  confidenceScore: number;
  evaluationTimeMs: number;
  additionalRequirements?: string[];
  context?: Record<string, any>;
}

export interface PolicyContext {
  userId: string;
  resource: string;
  action: string;
  ipAddress?: string;
  userAgent?: string;
  timestamp?: string;
  additionalContext?: Record<string, any>;
}

/**
 * AI Policy client for intelligent access control and policy management
 */
export class PolicyClient {
  constructor(private mainClient: any) {}

  /**
   * Evaluate policies for a given context
   */
  async evaluatePolicy(context: PolicyContext): Promise<PolicyEvaluation | null> {
    try {
      const contextData = {
        ...context,
        timestamp: context.timestamp || new Date().toISOString(),
      };

      const response = await this.mainClient.post('/api/ai/policy/evaluate', contextData);

      if (response.success && response.data) {
        return {
          decision: response.data.decision || PolicyAction.ALLOW,
          matchedRules: response.data.matched_rules || [],
          confidenceScore: response.data.confidence_score || 0.0,
          evaluationTimeMs: response.responseTimeMs || 0.0,
          additionalRequirements: response.data.additional_requirements,
          context: response.data.context,
        };
      }

      return null;
    } catch (error) {
      console.error('Policy evaluation failed:', error);
      return null;
    }
  }

  /**
   * Create a new policy rule
   */
  async createPolicyRule(rule: Omit<PolicyRule, 'createdAt' | 'updatedAt'>): Promise<boolean> {
    try {
      const response = await this.mainClient.post('/api/ai/policy/rules', rule);
      return response.success;
    } catch (error) {
      console.error('Error creating policy rule:', error);
      return false;
    }
  }

  /**
   * Update an existing policy rule
   */
  async updatePolicyRule(ruleId: string, updates: Partial<PolicyRule>): Promise<boolean> {
    try {
      const response = await this.mainClient.put(`/api/ai/policy/rules/${ruleId}`, updates);
      return response.success;
    } catch (error) {
      console.error('Error updating policy rule:', error);
      return false;
    }
  }

  /**
   * Delete a policy rule
   */
  async deletePolicyRule(ruleId: string): Promise<boolean> {
    try {
      const response = await this.mainClient.delete(`/api/ai/policy/rules/${ruleId}`);
      return response.success;
    } catch (error) {
      console.error('Error deleting policy rule:', error);
      return false;
    }
  }

  /**
   * Get a policy rule by ID
   */
  async getPolicyRule(ruleId: string): Promise<PolicyRule | null> {
    try {
      const response = await this.mainClient.get(`/api/ai/policy/rules/${ruleId}`);

      if (response.success && response.data) {
        return {
          ruleId: response.data.rule_id,
          name: response.data.name,
          description: response.data.description,
          action: response.data.action,
          conditions: response.data.conditions,
          priority: response.data.priority || 100,
          enabled: response.data.enabled !== false,
          createdAt: response.data.created_at,
          updatedAt: response.data.updated_at,
        };
      }

      return null;
    } catch (error) {
      console.error('Failed to get policy rule:', error);
      return null;
    }
  }

  /**
   * List policy rules with optional filtering
   */
  async listPolicyRules(
    enabledOnly: boolean = true,
    priorityMin?: number
  ): Promise<PolicyRule[]> {
    try {
      const params: Record<string, any> = {};
      if (enabledOnly) {
        params.enabled = 'true';
      }
      if (priorityMin !== undefined) {
        params.priority_min = priorityMin.toString();
      }

      const response = await this.mainClient.get('/api/ai/policy/rules', params);

      if (response.success && response.data) {
        return (response.data.rules || []).map((ruleData: any) => ({
          ruleId: ruleData.rule_id,
          name: ruleData.name,
          description: ruleData.description,
          action: ruleData.action,
          conditions: ruleData.conditions,
          priority: ruleData.priority || 100,
          enabled: ruleData.enabled !== false,
          createdAt: ruleData.created_at,
          updatedAt: ruleData.updated_at,
        }));
      }

      return [];
    } catch (error) {
      console.error('Failed to list policy rules:', error);
      return [];
    }
  }

  /**
   * Test a policy rule against a context
   */
  async testPolicyRule(
    ruleId: string,
    context: PolicyContext
  ): Promise<Record<string, any> | null> {
    try {
      const testData = {
        rule_id: ruleId,
        context,
      };

      const response = await this.mainClient.post('/api/ai/policy/test', testData);
      return response.success ? response.data : null;
    } catch (error) {
      console.error('Failed to test policy rule:', error);
      return null;
    }
  }

  /**
   * Get AI-powered policy recommendations
   */
  async getPolicyRecommendations(
    userId: string,
    analysisPeriod: string = '7d'
  ): Promise<Array<Record<string, any>>> {
    try {
      const params = {
        user_id: userId,
        period: analysisPeriod,
      };

      const response = await this.mainClient.get('/api/ai/policy/recommendations', params);

      if (response.success && response.data) {
        return response.data.recommendations || [];
      }

      return [];
    } catch (error) {
      console.error('Failed to get policy recommendations:', error);
      return [];
    }
  }

  /**
   * Analyze policy violations using AI
   */
  async analyzePolicyViolations(timeRange: string = '24h'): Promise<Record<string, any> | null> {
    try {
      const response = await this.mainClient.get('/api/ai/policy/violations/analyze', {
        range: timeRange,
      });

      return response.success ? response.data : null;
    } catch (error) {
      console.error('Failed to analyze policy violations:', error);
      return null;
    }
  }

  /**
   * Create an adaptive policy that learns from behavior
   */
  async createAdaptivePolicy(
    baseRule: Omit<PolicyRule, 'createdAt' | 'updatedAt'>,
    adaptationConfig: Record<string, any>
  ): Promise<string | null> {
    try {
      const adaptiveData = {
        base_rule: baseRule,
        adaptation_config: adaptationConfig,
      };

      const response = await this.mainClient.post('/api/ai/policy/adaptive', adaptiveData);

      if (response.success && response.data) {
        return response.data.policy_id;
      }

      return null;
    } catch (error) {
      console.error('Failed to create adaptive policy:', error);
      return null;
    }
  }

  /**
   * Get policy system metrics
   */
  async getPolicyMetrics(): Promise<Record<string, any> | null> {
    try {
      const response = await this.mainClient.get('/api/ai/policy/metrics');
      return response.success ? response.data : null;
    } catch (error) {
      console.error('Failed to get policy metrics:', error);
      return null;
    }
  }

  /**
   * Export all policies
   */
  async exportPolicies(formatType: 'json' | 'yaml' = 'json'): Promise<string | null> {
    try {
      const response = await this.mainClient.get('/api/ai/policy/export', {
        format: formatType,
      });

      return response.success ? response.data : null;
    } catch (error) {
      console.error('Failed to export policies:', error);
      return null;
    }
  }

  /**
   * Import policies from data
   */
  async importPolicies(
    policyData: string,
    formatType: 'json' | 'yaml' = 'json'
  ): Promise<boolean> {
    try {
      const importData = {
        data: policyData,
        format: formatType,
      };

      const response = await this.mainClient.post('/api/ai/policy/import', importData);
      return response.success;
    } catch (error) {
      console.error('Error importing policies:', error);
      return false;
    }
  }
}
