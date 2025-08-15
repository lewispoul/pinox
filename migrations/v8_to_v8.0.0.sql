-- NOX API v8.0.0 Database Migration Script
-- Migration from v7.x to v8.0.0
-- Run this script in staging before production deployment

BEGIN;

-- Create backup checkpoint
INSERT INTO migration_log (version, operation, timestamp, status) 
VALUES ('8.0.0', 'PRE_MIGRATION_CHECKPOINT', NOW(), 'STARTED');

-- Add new performance monitoring tables
CREATE TABLE IF NOT EXISTS webvitals_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    session_id VARCHAR(255),
    metric_name VARCHAR(50) NOT NULL,
    metric_value DECIMAL(10,3) NOT NULL,
    url VARCHAR(500),
    user_agent TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add new AI security audit tables
CREATE TABLE IF NOT EXISTS ai_security_audit (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    request_id VARCHAR(255),
    threat_level VARCHAR(20) CHECK (threat_level IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    threat_type VARCHAR(50),
    threat_details JSONB,
    request_data JSONB,
    response_action VARCHAR(50),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved BOOLEAN DEFAULT FALSE,
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolved_by UUID REFERENCES users(id)
);

-- Add new OAuth2 provider tracking
ALTER TABLE users ADD COLUMN IF NOT EXISTS provider_details JSONB DEFAULT '{}';
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_provider_sync TIMESTAMP WITH TIME ZONE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS multi_provider_enabled BOOLEAN DEFAULT FALSE;

-- Add new performance optimization columns
ALTER TABLE computational_jobs ADD COLUMN IF NOT EXISTS optimization_level VARCHAR(20) DEFAULT 'STANDARD';
ALTER TABLE computational_jobs ADD COLUMN IF NOT EXISTS cache_key VARCHAR(255);
ALTER TABLE computational_jobs ADD COLUMN IF NOT EXISTS cache_hit BOOLEAN DEFAULT FALSE;
ALTER TABLE computational_jobs ADD COLUMN IF NOT EXISTS execution_metrics JSONB DEFAULT '{}';

-- Create new indexes for v8.0.0 performance improvements
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_webvitals_user_timestamp ON webvitals_metrics(user_id, timestamp DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_webvitals_session_timestamp ON webvitals_metrics(session_id, timestamp DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_webvitals_metric_name ON webvitals_metrics(metric_name);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ai_security_user_timestamp ON ai_security_audit(user_id, timestamp DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ai_security_threat_level ON ai_security_audit(threat_level);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ai_security_unresolved ON ai_security_audit(resolved, timestamp) WHERE resolved = FALSE;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_provider_details ON users USING GIN(provider_details);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_last_sync ON users(last_provider_sync);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_jobs_cache_key ON computational_jobs(cache_key) WHERE cache_key IS NOT NULL;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_jobs_optimization_level ON computational_jobs(optimization_level);

-- Update existing user records with new OAuth2 structure
UPDATE users SET 
    provider_details = jsonb_build_object(
        provider,
        jsonb_build_object(
            'user_id', external_id,
            'email', email,
            'last_login', last_login,
            'verified', email_verified
        )
    ),
    multi_provider_enabled = FALSE,
    last_provider_sync = last_login
WHERE provider_details = '{}' OR provider_details IS NULL;

-- Create new WebSocket connection tracking table
CREATE TABLE IF NOT EXISTS websocket_connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    connection_id VARCHAR(255) UNIQUE NOT NULL,
    channel_subscriptions JSONB DEFAULT '[]',
    connected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_ping TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    disconnected_at TIMESTAMP WITH TIME ZONE,
    connection_duration INTEGER,
    total_messages_sent INTEGER DEFAULT 0,
    total_messages_received INTEGER DEFAULT 0
);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_websocket_user_id ON websocket_connections(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_websocket_connection_id ON websocket_connections(connection_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_websocket_active ON websocket_connections(connected_at) WHERE disconnected_at IS NULL;

-- Add new system configuration table
CREATE TABLE IF NOT EXISTS system_configuration (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    config_key VARCHAR(100) UNIQUE NOT NULL,
    config_value JSONB NOT NULL,
    config_type VARCHAR(50) DEFAULT 'APPLICATION',
    description TEXT,
    is_sensitive BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by UUID REFERENCES users(id)
);

-- Insert default v8.0.0 configurations
INSERT INTO system_configuration (config_key, config_value, config_type, description) VALUES
    ('webvitals_collection_enabled', 'true', 'PERFORMANCE', 'Enable WebVitals metrics collection'),
    ('ai_security_monitoring_enabled', 'true', 'SECURITY', 'Enable AI-powered security monitoring'),
    ('websocket_max_connections_per_user', '10', 'CONNECTION', 'Maximum WebSocket connections per user'),
    ('cache_optimization_enabled', 'true', 'PERFORMANCE', 'Enable computational result caching'),
    ('multi_provider_oauth_enabled', 'true', 'AUTHENTICATION', 'Allow users to link multiple OAuth providers')
ON CONFLICT (config_key) DO NOTHING;

-- Add new audit trail for administrative actions
CREATE TABLE IF NOT EXISTS admin_audit_trail (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50),
    resource_id VARCHAR(255),
    details JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    session_id VARCHAR(255)
);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_admin_audit_user_timestamp ON admin_audit_trail(admin_user_id, timestamp DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_admin_audit_action ON admin_audit_trail(action);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_admin_audit_resource ON admin_audit_trail(resource_type, resource_id);

-- Update computational_jobs table with new v8.0.0 job types
ALTER TABLE computational_jobs ADD COLUMN IF NOT EXISTS job_version VARCHAR(10) DEFAULT '8.0.0';
ALTER TABLE computational_jobs ADD COLUMN IF NOT EXISTS error_recovery_attempts INTEGER DEFAULT 0;
ALTER TABLE computational_jobs ADD COLUMN IF NOT EXISTS parent_job_id UUID REFERENCES computational_jobs(id);

-- Add support for batch job processing
CREATE TABLE IF NOT EXISTS batch_job_collections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    collection_name VARCHAR(255) NOT NULL,
    total_jobs INTEGER DEFAULT 0,
    completed_jobs INTEGER DEFAULT 0,
    failed_jobs INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    estimated_completion TIMESTAMP WITH TIME ZONE,
    priority INTEGER DEFAULT 5
);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_batch_collections_user ON batch_job_collections(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_batch_collections_status ON batch_job_collections(status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_batch_collections_priority ON batch_job_collections(priority, created_at);

-- Link individual jobs to batch collections
ALTER TABLE computational_jobs ADD COLUMN IF NOT EXISTS batch_collection_id UUID REFERENCES batch_job_collections(id);

-- Create function to update batch job statistics
CREATE OR REPLACE FUNCTION update_batch_job_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.batch_collection_id IS NOT NULL THEN
        UPDATE batch_job_collections SET
            completed_jobs = (
                SELECT COUNT(*) FROM computational_jobs 
                WHERE batch_collection_id = NEW.batch_collection_id 
                AND status = 'COMPLETED'
            ),
            failed_jobs = (
                SELECT COUNT(*) FROM computational_jobs 
                WHERE batch_collection_id = NEW.batch_collection_id 
                AND status = 'FAILED'
            ),
            status = CASE 
                WHEN (SELECT COUNT(*) FROM computational_jobs WHERE batch_collection_id = NEW.batch_collection_id AND status IN ('PENDING', 'RUNNING')) = 0 THEN 'COMPLETED'
                ELSE 'RUNNING'
            END
        WHERE id = NEW.batch_collection_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic batch statistics updates
DROP TRIGGER IF EXISTS trigger_update_batch_stats ON computational_jobs;
CREATE TRIGGER trigger_update_batch_stats
    AFTER UPDATE ON computational_jobs
    FOR EACH ROW
    WHEN (OLD.status IS DISTINCT FROM NEW.status)
    EXECUTE FUNCTION update_batch_job_stats();

-- Add new rate limiting tables for v8.0.0
CREATE TABLE IF NOT EXISTS rate_limit_buckets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    endpoint VARCHAR(255) NOT NULL,
    bucket_key VARCHAR(255) NOT NULL,
    request_count INTEGER DEFAULT 0,
    window_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    window_duration INTERVAL DEFAULT '1 hour',
    max_requests INTEGER DEFAULT 1000,
    blocked_until TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id, endpoint, bucket_key)
);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_rate_limit_user_endpoint ON rate_limit_buckets(user_id, endpoint);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_rate_limit_window ON rate_limit_buckets(window_start);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_rate_limit_blocked ON rate_limit_buckets(blocked_until) WHERE blocked_until IS NOT NULL;

-- Migration data validation queries
-- These will be run after migration to ensure data integrity

-- Validation: Check if all users have provider_details populated
INSERT INTO migration_validation (check_name, check_query, expected_result, actual_result, status, timestamp) VALUES 
(
    'users_provider_details_populated',
    'SELECT COUNT(*) FROM users WHERE provider_details IS NULL OR provider_details = ''{}''',
    0,
    (SELECT COUNT(*) FROM users WHERE provider_details IS NULL OR provider_details = '{}'),
    CASE WHEN (SELECT COUNT(*) FROM users WHERE provider_details IS NULL OR provider_details = '{}') = 0 THEN 'PASSED' ELSE 'FAILED' END,
    NOW()
);

-- Validation: Check if new indexes were created successfully
INSERT INTO migration_validation (check_name, check_query, expected_result, actual_result, status, timestamp) VALUES 
(
    'new_indexes_created',
    'SELECT COUNT(*) FROM pg_indexes WHERE tablename IN (''webvitals_metrics'', ''ai_security_audit'', ''websocket_connections'') AND schemaname = ''public''',
    9, -- Expected number of new indexes
    (SELECT COUNT(*) FROM pg_indexes WHERE tablename IN ('webvitals_metrics', 'ai_security_audit', 'websocket_connections') AND schemaname = 'public'),
    CASE WHEN (SELECT COUNT(*) FROM pg_indexes WHERE tablename IN ('webvitals_metrics', 'ai_security_audit', 'websocket_connections') AND schemaname = 'public') >= 9 THEN 'PASSED' ELSE 'FAILED' END,
    NOW()
);

-- Create migration validation table if it doesn't exist
CREATE TABLE IF NOT EXISTS migration_validation (
    id SERIAL PRIMARY KEY,
    check_name VARCHAR(255) NOT NULL,
    check_query TEXT NOT NULL,
    expected_result INTEGER,
    actual_result INTEGER,
    status VARCHAR(20) CHECK (status IN ('PASSED', 'FAILED', 'WARNING')),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create migration log table if it doesn't exist
CREATE TABLE IF NOT EXISTS migration_log (
    id SERIAL PRIMARY KEY,
    version VARCHAR(20) NOT NULL,
    operation VARCHAR(100) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(20) CHECK (status IN ('STARTED', 'COMPLETED', 'FAILED')),
    error_message TEXT
);

-- Final migration checkpoint
INSERT INTO migration_log (version, operation, timestamp, status) 
VALUES ('8.0.0', 'MIGRATION_COMPLETED', NOW(), 'COMPLETED');

-- Update database schema version
INSERT INTO system_configuration (config_key, config_value, config_type, description) VALUES
    ('database_schema_version', '"8.0.0"', 'SYSTEM', 'Current database schema version')
ON CONFLICT (config_key) DO UPDATE SET 
    config_value = '"8.0.0"',
    updated_at = NOW();

COMMIT;

-- Post-migration analysis queries (run these after COMMIT to verify success)

-- Query 1: Verify table creation and row counts
\echo '=== POST-MIGRATION VERIFICATION QUERIES ==='
\echo ''

\echo '1. New table creation verification:'
SELECT 
    schemaname,
    tablename,
    hasindexes,
    hasrules,
    hastriggers
FROM pg_tables 
WHERE tablename IN (
    'webvitals_metrics', 
    'ai_security_audit', 
    'websocket_connections',
    'system_configuration',
    'admin_audit_trail',
    'batch_job_collections',
    'rate_limit_buckets',
    'migration_validation',
    'migration_log'
) 
ORDER BY tablename;

\echo ''
\echo '2. Index creation verification:'
SELECT 
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename IN ('webvitals_metrics', 'ai_security_audit', 'websocket_connections')
ORDER BY tablename, indexname;

\echo ''
\echo '3. User data migration verification:'
SELECT 
    COUNT(*) as total_users,
    COUNT(CASE WHEN provider_details != '{}' THEN 1 END) as users_with_provider_details,
    COUNT(CASE WHEN multi_provider_enabled IS NOT NULL THEN 1 END) as users_with_multi_provider_flag
FROM users;

\echo ''
\echo '4. Configuration entries verification:'
SELECT 
    config_key,
    config_type,
    is_sensitive,
    created_at
FROM system_configuration 
WHERE config_key LIKE '%8.0.0%' OR created_at > NOW() - INTERVAL '1 hour'
ORDER BY created_at DESC;

\echo ''
\echo '5. Migration validation results:'
SELECT 
    check_name,
    status,
    expected_result,
    actual_result,
    timestamp
FROM migration_validation
ORDER BY timestamp DESC;

\echo ''
\echo '=== MIGRATION VERIFICATION COMPLETED ==='
