-- M7 Database Schema Enhancement for Complete OAuth2 Integration
-- Date: August 13, 2025

-- OAuth2 tokens table for secure token management
CREATE TABLE IF NOT EXISTS oauth2_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL,
    access_token TEXT NOT NULL,
    refresh_token TEXT,
    token_type VARCHAR(20) DEFAULT 'Bearer',
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    refresh_expires_at TIMESTAMP WITH TIME ZONE,
    scope TEXT,
    is_revoked BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- OAuth2 provider profiles for user info synchronization  
CREATE TABLE IF NOT EXISTS oauth2_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL,
    provider_user_id VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    username VARCHAR(255),
    avatar_url TEXT,
    profile_url TEXT,
    location VARCHAR(255),
    company VARCHAR(255),
    bio TEXT,
    profile_data JSONB, -- Raw provider profile data
    email_verified BOOLEAN DEFAULT false,
    last_sync TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(provider, provider_user_id),
    UNIQUE(user_id, provider) -- One profile per provider per user
);

-- OAuth2 login sessions for tracking OAuth2 authentication events
CREATE TABLE IF NOT EXISTS oauth2_login_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL,
    session_token VARCHAR(255) NOT NULL, -- Temporary session token during OAuth flow
    state_token VARCHAR(255) NOT NULL,   -- OAuth state parameter for security
    client_ip INET,
    user_agent TEXT,
    redirect_uri TEXT,
    scopes_requested TEXT,
    scopes_granted TEXT,
    status VARCHAR(50) DEFAULT 'pending', -- pending, completed, failed, expired
    error_code VARCHAR(100),
    error_description TEXT,
    completed_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '10 minutes'),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- OAuth2 refresh token history for audit and security
CREATE TABLE IF NOT EXISTS oauth2_token_refreshes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token_id UUID REFERENCES oauth2_tokens(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    old_access_token_hash VARCHAR(64), -- SHA-256 hash of old token for audit
    new_access_token_hash VARCHAR(64), -- SHA-256 hash of new token  
    refresh_reason VARCHAR(100) DEFAULT 'automatic', -- automatic, manual, forced
    client_ip INET,
    user_agent TEXT,
    success BOOLEAN DEFAULT true,
    error_message TEXT,
    refreshed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for optimal OAuth2 performance
CREATE INDEX IF NOT EXISTS idx_oauth2_tokens_user_provider ON oauth2_tokens (user_id, provider);
CREATE INDEX IF NOT EXISTS idx_oauth2_tokens_expires_at ON oauth2_tokens (expires_at);
CREATE INDEX IF NOT EXISTS idx_oauth2_tokens_revoked ON oauth2_tokens (is_revoked) WHERE is_revoked = false;
CREATE INDEX IF NOT EXISTS idx_oauth2_tokens_refresh_expires ON oauth2_tokens (refresh_expires_at);

CREATE INDEX IF NOT EXISTS idx_oauth2_profiles_user_provider ON oauth2_profiles (user_id, provider);
CREATE INDEX IF NOT EXISTS idx_oauth2_profiles_provider_user_id ON oauth2_profiles (provider, provider_user_id);
CREATE INDEX IF NOT EXISTS idx_oauth2_profiles_email ON oauth2_profiles (email);
CREATE INDEX IF NOT EXISTS idx_oauth2_profiles_last_sync ON oauth2_profiles (last_sync);

CREATE INDEX IF NOT EXISTS idx_oauth2_login_sessions_user ON oauth2_login_sessions (user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_oauth2_login_sessions_status ON oauth2_login_sessions (status, created_at);
CREATE INDEX IF NOT EXISTS idx_oauth2_login_sessions_expires ON oauth2_login_sessions (expires_at);
CREATE INDEX IF NOT EXISTS idx_oauth2_login_sessions_state ON oauth2_login_sessions (state_token);

CREATE INDEX IF NOT EXISTS idx_oauth2_token_refreshes_token ON oauth2_token_refreshes (token_id, refreshed_at);
CREATE INDEX IF NOT EXISTS idx_oauth2_token_refreshes_user ON oauth2_token_refreshes (user_id, refreshed_at);

-- Create trigger functions for OAuth2 table maintenance
CREATE OR REPLACE FUNCTION update_oauth2_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update updated_at timestamps
CREATE TRIGGER trigger_oauth2_tokens_updated_at
    BEFORE UPDATE ON oauth2_tokens
    FOR EACH ROW
    EXECUTE FUNCTION update_oauth2_updated_at();

CREATE TRIGGER trigger_oauth2_profiles_updated_at
    BEFORE UPDATE ON oauth2_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_oauth2_updated_at();

-- Create cleanup function for expired OAuth2 login sessions
CREATE OR REPLACE FUNCTION cleanup_expired_oauth2_sessions()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    -- Delete expired login sessions older than 1 hour
    DELETE FROM oauth2_login_sessions 
    WHERE status = 'pending' 
      AND expires_at < NOW() - INTERVAL '1 hour';
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Create function to revoke OAuth2 tokens
CREATE OR REPLACE FUNCTION revoke_oauth2_tokens(p_user_id UUID, p_provider VARCHAR(50) DEFAULT NULL)
RETURNS INTEGER AS $$
DECLARE
    revoked_count INTEGER;
BEGIN
    IF p_provider IS NOT NULL THEN
        -- Revoke tokens for specific provider
        UPDATE oauth2_tokens 
        SET is_revoked = true, updated_at = NOW()
        WHERE user_id = p_user_id 
          AND provider = p_provider 
          AND is_revoked = false;
    ELSE
        -- Revoke all tokens for user
        UPDATE oauth2_tokens 
        SET is_revoked = true, updated_at = NOW()
        WHERE user_id = p_user_id 
          AND is_revoked = false;
    END IF;
    
    GET DIAGNOSTICS revoked_count = ROW_COUNT;
    
    RETURN revoked_count;
END;
$$ LANGUAGE plpgsql;

-- Create function to get OAuth2 user statistics
CREATE OR REPLACE FUNCTION get_oauth2_user_stats()
RETURNS TABLE (
    provider VARCHAR(50),
    total_users BIGINT,
    active_tokens BIGINT,
    expired_tokens BIGINT,
    revoked_tokens BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        op.provider,
        COUNT(DISTINCT op.user_id) as total_users,
        COUNT(CASE WHEN ot.expires_at > NOW() AND ot.is_revoked = false THEN 1 END) as active_tokens,
        COUNT(CASE WHEN ot.expires_at <= NOW() AND ot.is_revoked = false THEN 1 END) as expired_tokens,
        COUNT(CASE WHEN ot.is_revoked = true THEN 1 END) as revoked_tokens
    FROM oauth2_profiles op
    LEFT JOIN oauth2_tokens ot ON op.user_id = ot.user_id AND op.provider = ot.provider
    GROUP BY op.provider
    ORDER BY op.provider;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions to noxuser
GRANT ALL ON oauth2_tokens TO noxuser;
GRANT ALL ON oauth2_profiles TO noxuser;
GRANT ALL ON oauth2_login_sessions TO noxuser;
GRANT ALL ON oauth2_token_refreshes TO noxuser;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO noxuser;

-- Add OAuth2 provider and user ID to the users table if not exists
ALTER TABLE users ADD COLUMN IF NOT EXISTS oauth_provider VARCHAR(50);
ALTER TABLE users ADD COLUMN IF NOT EXISTS oauth_id VARCHAR(255);

-- Create composite index for OAuth2 user lookup
CREATE INDEX IF NOT EXISTS idx_users_oauth ON users (oauth_provider, oauth_id) WHERE oauth_provider IS NOT NULL;

-- Update users table constraints to ensure OAuth2 uniqueness
ALTER TABLE users DROP CONSTRAINT IF EXISTS unique_oauth_user;
ALTER TABLE users ADD CONSTRAINT unique_oauth_user UNIQUE (oauth_provider, oauth_id);

-- Initialize OAuth2 system metadata table
CREATE TABLE IF NOT EXISTS oauth2_system_config (
    id SERIAL PRIMARY KEY,
    config_key VARCHAR(100) UNIQUE NOT NULL,
    config_value TEXT,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default OAuth2 system configuration
INSERT INTO oauth2_system_config (config_key, config_value, description) VALUES
    ('oauth2_version', '7.0.0', 'OAuth2 system version'),
    ('token_expiry_minutes', '60', 'Default access token expiry in minutes'),
    ('refresh_expiry_days', '30', 'Default refresh token expiry in days'),
    ('max_tokens_per_user', '10', 'Maximum active tokens per user per provider'),
    ('cleanup_interval_hours', '24', 'Cleanup interval for expired sessions'),
    ('session_timeout_minutes', '10', 'OAuth2 login session timeout')
ON CONFLICT (config_key) DO UPDATE SET 
    config_value = EXCLUDED.config_value,
    updated_at = NOW();

-- Grant permissions for system config
GRANT ALL ON oauth2_system_config TO noxuser;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO noxuser;

COMMENT ON TABLE oauth2_tokens IS 'OAuth2 access and refresh tokens with expiry management';
COMMENT ON TABLE oauth2_profiles IS 'OAuth2 user profile information synchronized from providers';
COMMENT ON TABLE oauth2_login_sessions IS 'OAuth2 authentication session tracking';
COMMENT ON TABLE oauth2_token_refreshes IS 'OAuth2 token refresh history for audit';
COMMENT ON TABLE oauth2_system_config IS 'OAuth2 system configuration parameters';
