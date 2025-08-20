-- M6 Database Schema Enhancement for Advanced Audit Logging
-- Date: August 13, 2025

-- Enhanced audit_sessions table for session tracking
CREATE TABLE IF NOT EXISTS audit_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_token_hash VARCHAR(64) NOT NULL,
    client_ip INET NOT NULL,
    user_agent TEXT,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    login_method VARCHAR(50) DEFAULT 'api_token' -- api_token, oauth_google, oauth_github
);

-- Enhanced audit_actions table for detailed action tracking  
CREATE TABLE IF NOT EXISTS audit_actions (
    id BIGSERIAL PRIMARY KEY,
    session_id UUID REFERENCES audit_sessions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    request_id UUID NOT NULL,
    
    -- Request Details
    endpoint VARCHAR(255) NOT NULL,
    http_method VARCHAR(10) NOT NULL,
    action_type VARCHAR(50) NOT NULL, -- 'file_read', 'file_write', 'file_delete', 'code_exec', 'admin_action', 'auth'
    action_category VARCHAR(50) NOT NULL, -- 'filesystem', 'execution', 'admin', 'auth', 'quota'
    
    -- Client Context
    client_ip INET NOT NULL,
    user_agent TEXT,
    
    -- Request/Response Data
    request_size INTEGER DEFAULT 0,
    response_size INTEGER DEFAULT 0,
    status_code INTEGER NOT NULL,
    success BOOLEAN NOT NULL,
    
    -- Performance Metrics
    response_time_ms INTEGER,
    cpu_time_ms INTEGER,
    memory_peak_mb INTEGER,
    
    -- Resource Usage (file operations)
    file_path TEXT,
    file_size_bytes INTEGER,
    files_affected INTEGER DEFAULT 0,
    
    -- Code Execution Details
    command_type VARCHAR(50), -- 'python', 'bash', 'nodejs'
    command_text TEXT,
    stdout_size INTEGER DEFAULT 0,
    stderr_size INTEGER DEFAULT 0,
    exit_code INTEGER,
    
    -- Quota Impact
    quota_consumed JSON, -- {'cpu_ms': 1500, 'memory_mb': 128, 'files': 1}
    quota_remaining JSON, -- {'cpu_ms': 2100, 'memory_mb': 384, 'files': 49}
    quota_violation BOOLEAN DEFAULT false,
    
    -- Additional Context
    metadata JSON, -- Flexible field for additional data
    error_details TEXT,
    
    -- Timestamps
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Admin actions tracking for elevated privileges
CREATE TABLE IF NOT EXISTS audit_admin_actions (
    id BIGSERIAL PRIMARY KEY,
    action_id BIGINT REFERENCES audit_actions(id) ON DELETE CASCADE,
    admin_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    target_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    
    admin_action_type VARCHAR(100) NOT NULL, -- 'quota_update', 'user_create', 'user_delete', 'log_export', 'system_config'
    old_values JSON, -- Previous state for rollback capability
    new_values JSON, -- New state applied
    justification TEXT, -- Admin reason for action
    
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Daily audit summaries for fast reporting
CREATE TABLE IF NOT EXISTS audit_daily_summaries (
    id BIGSERIAL PRIMARY KEY,
    summary_date DATE NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Activity Counts
    total_actions INTEGER DEFAULT 0,
    successful_actions INTEGER DEFAULT 0,
    failed_actions INTEGER DEFAULT 0,
    file_operations INTEGER DEFAULT 0,
    code_executions INTEGER DEFAULT 0,
    admin_actions INTEGER DEFAULT 0,
    
    -- Resource Usage Totals
    total_cpu_ms INTEGER DEFAULT 0,
    total_memory_mb INTEGER DEFAULT 0,
    files_created INTEGER DEFAULT 0,
    files_deleted INTEGER DEFAULT 0,
    
    -- Performance Metrics
    avg_response_time_ms INTEGER DEFAULT 0,
    max_response_time_ms INTEGER DEFAULT 0,
    
    -- Quota Violations
    quota_violations INTEGER DEFAULT 0,
    
    -- Session Info
    unique_sessions INTEGER DEFAULT 0,
    first_activity TIMESTAMP WITH TIME ZONE,
    last_activity TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE (summary_date, user_id)
);

-- Create indexes for audit_sessions
CREATE INDEX IF NOT EXISTS idx_audit_sessions_user_started ON audit_sessions (user_id, started_at);
CREATE INDEX IF NOT EXISTS idx_audit_sessions_token ON audit_sessions (session_token_hash);
CREATE INDEX IF NOT EXISTS idx_audit_sessions_ip ON audit_sessions (client_ip, started_at);
CREATE INDEX IF NOT EXISTS idx_audit_sessions_active ON audit_sessions (user_id) WHERE is_active = true;

-- Create indexes for audit_actions
CREATE INDEX IF NOT EXISTS idx_audit_actions_user_time ON audit_actions (user_id, timestamp);
CREATE INDEX IF NOT EXISTS idx_audit_actions_session_time ON audit_actions (session_id, timestamp);
CREATE INDEX IF NOT EXISTS idx_audit_actions_type_time ON audit_actions (action_type, timestamp);
CREATE INDEX IF NOT EXISTS idx_audit_actions_category_time ON audit_actions (action_category, timestamp);
CREATE INDEX IF NOT EXISTS idx_audit_actions_endpoint_time ON audit_actions (endpoint, timestamp);
CREATE INDEX IF NOT EXISTS idx_audit_actions_success_time ON audit_actions (success, timestamp);
CREATE INDEX IF NOT EXISTS idx_audit_actions_quota_violation ON audit_actions (quota_violation, timestamp);
CREATE INDEX IF NOT EXISTS idx_audit_actions_client_ip ON audit_actions (client_ip, timestamp);
CREATE INDEX IF NOT EXISTS idx_audit_actions_timestamp_desc ON audit_actions (timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_audit_actions_user_recent ON audit_actions (user_id, timestamp DESC);

-- Create indexes for audit_admin_actions
CREATE INDEX IF NOT EXISTS idx_audit_admin_actions_admin ON audit_admin_actions (admin_user_id, timestamp);
CREATE INDEX IF NOT EXISTS idx_audit_admin_actions_target ON audit_admin_actions (target_user_id, timestamp);
CREATE INDEX IF NOT EXISTS idx_audit_admin_actions_type ON audit_admin_actions (admin_action_type, timestamp);

-- Create indexes for audit_daily_summaries  
CREATE INDEX IF NOT EXISTS idx_audit_daily_summaries_date_user ON audit_daily_summaries (summary_date, user_id);
CREATE INDEX IF NOT EXISTS idx_audit_daily_summaries_date_actions ON audit_daily_summaries (summary_date, total_actions);

-- Create trigger function to update daily summaries
CREATE OR REPLACE FUNCTION update_audit_daily_summary()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_daily_summaries (
        summary_date, 
        user_id,
        total_actions,
        successful_actions,
        failed_actions,
        file_operations,
        code_executions,
        admin_actions,
        total_cpu_ms,
        total_memory_mb,
        files_created,
        files_deleted,
        avg_response_time_ms,
        max_response_time_ms,
        quota_violations,
        first_activity,
        last_activity
    )
    VALUES (
        DATE(NEW.timestamp),
        NEW.user_id,
        1,
        CASE WHEN NEW.success THEN 1 ELSE 0 END,
        CASE WHEN NOT NEW.success THEN 1 ELSE 0 END,
        CASE WHEN NEW.action_category = 'filesystem' THEN 1 ELSE 0 END,
        CASE WHEN NEW.action_category = 'execution' THEN 1 ELSE 0 END,
        CASE WHEN NEW.action_category = 'admin' THEN 1 ELSE 0 END,
        COALESCE(NEW.cpu_time_ms, 0),
        COALESCE(NEW.memory_peak_mb, 0),
        CASE WHEN NEW.action_type = 'file_write' THEN 1 ELSE 0 END,
        CASE WHEN NEW.action_type = 'file_delete' THEN 1 ELSE 0 END,
        COALESCE(NEW.response_time_ms, 0),
        COALESCE(NEW.response_time_ms, 0),
        CASE WHEN NEW.quota_violation THEN 1 ELSE 0 END,
        NEW.timestamp,
        NEW.timestamp
    )
    ON CONFLICT (summary_date, user_id) 
    DO UPDATE SET
        total_actions = audit_daily_summaries.total_actions + 1,
        successful_actions = audit_daily_summaries.successful_actions + CASE WHEN NEW.success THEN 1 ELSE 0 END,
        failed_actions = audit_daily_summaries.failed_actions + CASE WHEN NOT NEW.success THEN 1 ELSE 0 END,
        file_operations = audit_daily_summaries.file_operations + CASE WHEN NEW.action_category = 'filesystem' THEN 1 ELSE 0 END,
        code_executions = audit_daily_summaries.code_executions + CASE WHEN NEW.action_category = 'execution' THEN 1 ELSE 0 END,
        admin_actions = audit_daily_summaries.admin_actions + CASE WHEN NEW.action_category = 'admin' THEN 1 ELSE 0 END,
        total_cpu_ms = audit_daily_summaries.total_cpu_ms + COALESCE(NEW.cpu_time_ms, 0),
        total_memory_mb = audit_daily_summaries.total_memory_mb + COALESCE(NEW.memory_peak_mb, 0),
        files_created = audit_daily_summaries.files_created + CASE WHEN NEW.action_type = 'file_write' THEN 1 ELSE 0 END,
        files_deleted = audit_daily_summaries.files_deleted + CASE WHEN NEW.action_type = 'file_delete' THEN 1 ELSE 0 END,
        avg_response_time_ms = (audit_daily_summaries.avg_response_time_ms * (audit_daily_summaries.total_actions - 1) + COALESCE(NEW.response_time_ms, 0)) / audit_daily_summaries.total_actions,
        max_response_time_ms = GREATEST(audit_daily_summaries.max_response_time_ms, COALESCE(NEW.response_time_ms, 0)),
        quota_violations = audit_daily_summaries.quota_violations + CASE WHEN NEW.quota_violation THEN 1 ELSE 0 END,
        last_activity = NEW.timestamp;
        
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update daily summaries
CREATE TRIGGER trigger_update_audit_daily_summary
    AFTER INSERT ON audit_actions
    FOR EACH ROW
    EXECUTE FUNCTION update_audit_daily_summary();

-- Grant permissions
GRANT ALL ON audit_sessions TO noxuser;
GRANT ALL ON audit_actions TO noxuser;
GRANT ALL ON audit_admin_actions TO noxuser;
GRANT ALL ON audit_daily_summaries TO noxuser;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO noxuser;
