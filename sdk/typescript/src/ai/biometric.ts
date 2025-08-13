/**
 * Nox API TypeScript SDK - AI Biometric Client
 * v8.0.0 Developer Experience Enhancement
 *
 * AI-powered biometric authentication integration for advanced
 * user verification, behavioral biometrics, and adaptive authentication.
 */

export enum BiometricType {
  FINGERPRINT = 'fingerprint',
  FACE = 'face',
  VOICE = 'voice',
  BEHAVIORAL = 'behavioral',
  KEYSTROKE = 'keystroke',
  MULTI_MODAL = 'multi_modal',
}

export enum AuthenticationResult {
  SUCCESS = 'success',
  FAILURE = 'failure',
  PARTIAL = 'partial',
  REQUIRE_ADDITIONAL = 'require_additional',
  SUSPICIOUS = 'suspicious',
}

export interface BiometricTemplate {
  templateId: string;
  userId: string;
  biometricType: BiometricType;
  templateData: string; // Base64 encoded
  qualityScore: number;
  createdAt: string;
  expiresAt?: string;
  metadata?: Record<string, any>;
}

export interface BiometricChallenge {
  challengeId: string;
  userId: string;
  challengeType: BiometricType;
  challengeData?: string;
  expiresAt: string;
  attemptCount?: number;
  maxAttempts?: number;
  metadata?: Record<string, any>;
}

export interface AuthenticationResponse {
  result: AuthenticationResult;
  confidenceScore: number;
  matchedTemplates: string[];
  processingTimeMs: number;
  challengeId?: string;
  additionalRequirements?: string[];
  fraudIndicators?: string[];
}

/**
 * AI Biometric client for advanced authentication and verification
 */
export class BiometricClient {
  constructor(private mainClient: any) {}

  /**
   * Enroll a biometric template for a user
   */
  async enrollBiometric(
    userId: string,
    biometricType: BiometricType,
    biometricData: string | ArrayBuffer,
    metadata?: Record<string, any>
  ): Promise<BiometricTemplate | null> {
    try {
      // Encode biometric data if needed
      let encodedData: string;
      if (biometricData instanceof ArrayBuffer) {
        encodedData = this.arrayBufferToBase64(biometricData);
      } else {
        encodedData = biometricData;
      }

      const enrollmentData = {
        user_id: userId,
        biometric_type: biometricType,
        biometric_data: encodedData,
        metadata: metadata || {},
      };

      const response = await this.mainClient.post('/api/ai/biometric/enroll', enrollmentData);

      if (response.success && response.data) {
        return {
          templateId: response.data.template_id,
          userId,
          biometricType,
          templateData: response.data.template_data,
          qualityScore: response.data.quality_score || 0.0,
          createdAt: response.data.created_at || new Date().toISOString(),
          expiresAt: response.data.expires_at,
          metadata: response.data.metadata,
        };
      }

      return null;
    } catch (error) {
      console.error('Biometric enrollment failed:', error);
      return null;
    }
  }

  /**
   * Authenticate using biometric data
   */
  async authenticateBiometric(
    userId: string,
    biometricType: BiometricType,
    biometricData: string | ArrayBuffer,
    challengeId?: string
  ): Promise<AuthenticationResponse | null> {
    try {
      // Encode biometric data if needed
      let encodedData: string;
      if (biometricData instanceof ArrayBuffer) {
        encodedData = this.arrayBufferToBase64(biometricData);
      } else {
        encodedData = biometricData;
      }

      const authData = {
        user_id: userId,
        biometric_type: biometricType,
        biometric_data: encodedData,
        challenge_id: challengeId,
      };

      const response = await this.mainClient.post('/api/ai/biometric/authenticate', authData);

      if (response.success && response.data) {
        return {
          result: response.data.result || AuthenticationResult.FAILURE,
          confidenceScore: response.data.confidence_score || 0.0,
          matchedTemplates: response.data.matched_templates || [],
          processingTimeMs: response.responseTimeMs || 0.0,
          challengeId: response.data.challenge_id,
          additionalRequirements: response.data.additional_requirements,
          fraudIndicators: response.data.fraud_indicators,
        };
      }

      return null;
    } catch (error) {
      console.error('Biometric authentication failed:', error);
      return null;
    }
  }

  /**
   * Create a biometric authentication challenge
   */
  async createAuthenticationChallenge(
    userId: string,
    challengeType: BiometricType,
    expiresIn: number = 300,
    maxAttempts: number = 3
  ): Promise<BiometricChallenge | null> {
    try {
      const challengeData = {
        user_id: userId,
        challenge_type: challengeType,
        expires_in: expiresIn,
        max_attempts: maxAttempts,
      };

      const response = await this.mainClient.post(
        '/api/ai/biometric/challenge/create',
        challengeData
      );

      if (response.success && response.data) {
        return {
          challengeId: response.data.challenge_id,
          userId,
          challengeType,
          challengeData: response.data.challenge_data,
          expiresAt: response.data.expires_at,
          maxAttempts,
          attemptCount: 0,
        };
      }

      return null;
    } catch (error) {
      console.error('Failed to create biometric challenge:', error);
      return null;
    }
  }

  /**
   * Verify response to a biometric challenge
   */
  async verifyChallengeResponse(
    challengeId: string,
    biometricData: string | ArrayBuffer
  ): Promise<AuthenticationResponse | null> {
    try {
      // Encode biometric data if needed
      let encodedData: string;
      if (biometricData instanceof ArrayBuffer) {
        encodedData = this.arrayBufferToBase64(biometricData);
      } else {
        encodedData = biometricData;
      }

      const verifyData = {
        challenge_id: challengeId,
        biometric_data: encodedData,
      };

      const response = await this.mainClient.post('/api/ai/biometric/challenge/verify', verifyData);

      if (response.success && response.data) {
        return {
          result: response.data.result || AuthenticationResult.FAILURE,
          confidenceScore: response.data.confidence_score || 0.0,
          matchedTemplates: response.data.matched_templates || [],
          processingTimeMs: response.responseTimeMs || 0.0,
          challengeId: response.data.challenge_id,
          additionalRequirements: response.data.additional_requirements,
          fraudIndicators: response.data.fraud_indicators,
        };
      }

      return null;
    } catch (error) {
      console.error('Challenge verification failed:', error);
      return null;
    }
  }

  /**
   * Get all biometric templates for a user
   */
  async getUserTemplates(userId: string): Promise<BiometricTemplate[]> {
    try {
      const response = await this.mainClient.get(`/api/ai/biometric/templates/${userId}`);

      if (response.success && response.data) {
        return (response.data.templates || []).map((templateData: any) => ({
          templateId: templateData.template_id,
          userId,
          biometricType: templateData.biometric_type,
          templateData: templateData.template_data,
          qualityScore: templateData.quality_score || 0.0,
          createdAt: templateData.created_at || '',
          expiresAt: templateData.expires_at,
          metadata: templateData.metadata,
        }));
      }

      return [];
    } catch (error) {
      console.error('Failed to get user templates:', error);
      return [];
    }
  }

  /**
   * Delete a biometric template
   */
  async deleteTemplate(templateId: string): Promise<boolean> {
    try {
      const response = await this.mainClient.delete(`/api/ai/biometric/templates/${templateId}`);
      return response.success;
    } catch (error) {
      console.error('Error deleting template:', error);
      return false;
    }
  }

  /**
   * Analyze behavioral biometric patterns
   */
  async analyzeBehavioralPattern(
    userId: string,
    behavioralData: Record<string, any>
  ): Promise<Record<string, any> | null> {
    try {
      const analysisData = {
        user_id: userId,
        behavioral_data: behavioralData,
        analysis_type: 'pattern_recognition',
      };

      const response = await this.mainClient.post(
        '/api/ai/biometric/behavioral/analyze',
        analysisData
      );

      return response.success ? response.data : null;
    } catch (error) {
      console.error('Behavioral pattern analysis failed:', error);
      return null;
    }
  }

  /**
   * Perform liveness detection to prevent spoofing
   */
  async detectLiveness(
    biometricType: BiometricType,
    biometricData: string | ArrayBuffer
  ): Promise<Record<string, any> | null> {
    try {
      // Encode data if needed
      let encodedData: string;
      if (biometricData instanceof ArrayBuffer) {
        encodedData = this.arrayBufferToBase64(biometricData);
      } else {
        encodedData = biometricData;
      }

      const livenessData = {
        biometric_type: biometricType,
        biometric_data: encodedData,
      };

      const response = await this.mainClient.post('/api/ai/biometric/liveness', livenessData);
      return response.success ? response.data : null;
    } catch (error) {
      console.error('Liveness detection failed:', error);
      return null;
    }
  }

  /**
   * Get fraud analysis for biometric authentications
   */
  async getFraudAnalysis(
    userId: string,
    timeRange: string = '24h'
  ): Promise<Record<string, any> | null> {
    try {
      const response = await this.mainClient.get(`/api/ai/biometric/fraud-analysis/${userId}`, {
        range: timeRange,
      });

      return response.success ? response.data : null;
    } catch (error) {
      console.error('Failed to get fraud analysis:', error);
      return null;
    }
  }

  /**
   * Configure biometric settings for a user
   */
  async configureBiometricSettings(
    userId: string,
    settings: Record<string, any>
  ): Promise<boolean> {
    try {
      const response = await this.mainClient.put(`/api/ai/biometric/settings/${userId}`, settings);
      return response.success;
    } catch (error) {
      console.error('Error configuring biometric settings:', error);
      return false;
    }
  }

  /**
   * Get authentication statistics for a user
   */
  async getAuthenticationStats(userId: string): Promise<Record<string, any> | null> {
    try {
      const response = await this.mainClient.get(`/api/ai/biometric/stats/${userId}`);
      return response.success ? response.data : null;
    } catch (error) {
      console.error('Failed to get authentication stats:', error);
      return null;
    }
  }

  /**
   * Create a multi-modal biometric template
   */
  async createMultiModalTemplate(
    userId: string,
    biometricDataMap: Record<BiometricType, string | ArrayBuffer>
  ): Promise<string | null> {
    try {
      // Prepare multi-modal data
      const modalData: Record<string, string> = {};
      for (const [bioType, data] of Object.entries(biometricDataMap)) {
        if (data instanceof ArrayBuffer) {
          modalData[bioType] = this.arrayBufferToBase64(data);
        } else {
          modalData[bioType] = data;
        }
      }

      const templateData = {
        user_id: userId,
        biometric_data: modalData,
      };

      const response = await this.mainClient.post(
        '/api/ai/biometric/multi-modal/enroll',
        templateData
      );

      if (response.success && response.data) {
        return response.data.template_id;
      }

      return null;
    } catch (error) {
      console.error('Failed to create multi-modal template:', error);
      return null;
    }
  }

  /**
   * Utility: Convert ArrayBuffer to Base64
   */
  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  /**
   * Utility: Convert Base64 to ArrayBuffer
   */
  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }
}
