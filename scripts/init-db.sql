-- init-db.sql - Initialize PostgreSQL database for Nox
-- This script creates the necessary tables for Nox authentication system

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password TEXT NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Quota fields
    quota_files INTEGER NOT NULL DEFAULT 100,
    quota_cpu_seconds INTEGER NOT NULL DEFAULT 3600,
    quota_memory_mb INTEGER NOT NULL DEFAULT 512,
    quota_storage_mb INTEGER NOT NULL DEFAULT 1024,
    
    -- Usage tracking
    used_files INTEGER NOT NULL DEFAULT 0,
    used_cpu_seconds INTEGER NOT NULL DEFAULT 0,
    used_storage_mb INTEGER NOT NULL DEFAULT 0,
    
    -- OAuth2 integration
    oauth_provider VARCHAR(50),
    oauth_id VARCHAR(255),
    
    CONSTRAINT valid_role CHECK (role IN ('admin', 'user')),
    CONSTRAINT positive_quotas CHECK (
        quota_files >= 0 AND 
        quota_cpu_seconds >= 0 AND 
        quota_memory_mb >= 0 AND
        quota_storage_mb >= 0
    )
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users (role);
CREATE INDEX IF NOT EXISTS idx_users_oauth ON users (oauth_provider, oauth_id);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users (created_at);

-- Create execution logs table for auditing
CREATE TABLE IF NOT EXISTS execution_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    request_id UUID NOT NULL,
    endpoint VARCHAR(255) NOT NULL,
    method VARCHAR(10) NOT NULL,
    status_code INTEGER NOT NULL,
    execution_time_ms INTEGER,
    cpu_usage_ms INTEGER,
    memory_usage_mb INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Execution details
    command_type VARCHAR(50), -- 'python', 'shell', etc.
    command_text TEXT,
    stdout_size INTEGER DEFAULT 0,
    stderr_size INTEGER DEFAULT 0
);

-- Create indexes for execution logs
CREATE INDEX IF NOT EXISTS idx_execution_logs_user_id ON execution_logs (user_id);
CREATE INDEX IF NOT EXISTS idx_execution_logs_created_at ON execution_logs (created_at);
CREATE INDEX IF NOT EXISTS idx_execution_logs_request_id ON execution_logs (request_id);

-- Create quota usage summary view
CREATE OR REPLACE VIEW user_quota_usage AS
SELECT 
    u.id,
    u.email,
    u.role,
    u.quota_files,
    u.quota_cpu_seconds,
    u.quota_memory_mb,
    u.quota_storage_mb,
    u.used_files,
    u.used_cpu_seconds,
    u.used_storage_mb,
    
    -- Usage ratios
    CASE WHEN u.quota_files > 0 THEN u.used_files::DECIMAL / u.quota_files ELSE 0 END as files_usage_ratio,
    CASE WHEN u.quota_cpu_seconds > 0 THEN u.used_cpu_seconds::DECIMAL / u.quota_cpu_seconds ELSE 0 END as cpu_usage_ratio,
    CASE WHEN u.quota_storage_mb > 0 THEN u.used_storage_mb::DECIMAL / u.quota_storage_mb ELSE 0 END as storage_usage_ratio,
    
    -- Recent activity
    COALESCE(recent.total_requests, 0) as requests_last_24h,
    COALESCE(recent.total_execution_time_ms, 0) as execution_time_last_24h_ms
FROM users u
LEFT JOIN (
    SELECT 
        user_id,
        COUNT(*) as total_requests,
        SUM(execution_time_ms) as total_execution_time_ms
    FROM execution_logs 
    WHERE created_at >= CURRENT_TIMESTAMP - INTERVAL '24 hours'
    GROUP BY user_id
) recent ON u.id = recent.user_id;

-- Function to update user usage statistics
CREATE OR REPLACE FUNCTION update_user_usage(
    p_user_id UUID,
    p_cpu_usage_ms INTEGER DEFAULT 0,
    p_storage_delta_mb INTEGER DEFAULT 0,
    p_files_delta INTEGER DEFAULT 0
) RETURNS VOID AS $$
BEGIN
    UPDATE users 
    SET 
        used_cpu_seconds = used_cpu_seconds + (p_cpu_usage_ms / 1000),
        used_storage_mb = GREATEST(0, used_storage_mb + p_storage_delta_mb),
        used_files = GREATEST(0, used_files + p_files_delta),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create initial admin user (will be overridden by application if needed)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@example.com') THEN
        INSERT INTO users (
            email, 
            hashed_password, 
            role, 
            quota_files, 
            quota_cpu_seconds, 
            quota_memory_mb,
            quota_storage_mb
        ) VALUES (
            'admin@example.com',
            '$2b$12$placeholder.hash.will.be.overridden.by.app',
            'admin',
            10000,
            86400,  -- 24 hours
            4096,   -- 4GB
            10240   -- 10GB
        );
    END IF;
END $$;
