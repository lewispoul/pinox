#!/bin/bash
# Nox API v7.0.0 - Rollback Script
# Automated rollback with version management

set -e

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
BACKUP_DIR="$PROJECT_DIR/backups"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

# Function to list available backups
list_backups() {
    log_info "Available backups:"
    echo
    
    if [[ ! -d "$BACKUP_DIR" ]]; then
        log_warning "No backup directory found at: $BACKUP_DIR"
        return 1
    fi
    
    local backups=($(ls -1t "$BACKUP_DIR"/ 2>/dev/null | grep "^backup_" || true))
    
    if [[ ${#backups[@]} -eq 0 ]]; then
        log_warning "No backups found in: $BACKUP_DIR"
        return 1
    fi
    
    echo "ID  | Backup Name                    | Created"
    echo "----|---------------------------------|--------------------"
    
    for i in "${!backups[@]}"; do
        local backup="${backups[$i]}"
        local backup_path="$BACKUP_DIR/$backup"
        local created=$(stat -c %y "$backup_path" 2>/dev/null | cut -d. -f1)
        printf "%-3d | %-30s | %s\n" "$((i+1))" "$backup" "$created"
    done
    
    echo
    return 0
}

# Function to create backup before rollback
create_current_backup() {
    log_info "Creating backup of current state..."
    
    mkdir -p "$BACKUP_DIR"
    
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local backup_name="backup_current_${timestamp}"
    local backup_path="$BACKUP_DIR/$backup_name"
    
    mkdir -p "$backup_path"
    
    # Backup current configuration
    if [[ -f "$PROJECT_DIR/.env" ]]; then
        cp "$PROJECT_DIR/.env" "$backup_path/"
        log_info "Backed up .env file"
    fi
    
    # Backup docker-compose files
    for compose_file in docker-compose.yml docker-compose.dev.yml; do
        if [[ -f "$PROJECT_DIR/$compose_file" ]]; then
            cp "$PROJECT_DIR/$compose_file" "$backup_path/"
            log_info "Backed up $compose_file"
        fi
    done
    
    # Export database if possible
    if docker-compose ps postgres | grep -q "Up"; then
        log_info "Exporting database..."
        docker-compose exec -T postgres pg_dump -U noxapi noxdb > "$backup_path/database_dump.sql" 2>/dev/null || \
            log_warning "Could not export database"
    fi
    
    # Save current image information
    docker image ls --format "table {{.Repository}}:{{.Tag}}\t{{.ID}}\t{{.CreatedAt}}" | \
        grep "nox-api" > "$backup_path/images.txt" 2>/dev/null || true
    
    # Save metadata
    cat > "$backup_path/metadata.json" <<EOF
{
    "timestamp": "$timestamp",
    "backup_type": "current_state",
    "created_by": "rollback_script",
    "git_commit": "$(git rev-parse HEAD 2>/dev/null || echo 'unknown')",
    "git_branch": "$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo 'unknown')",
    "docker_images": [
        $(docker image ls --format '"{{.Repository}}:{{.Tag}}"' | grep nox-api | head -3 | paste -sd, -)
    ]
}
EOF
    
    log_success "Current state backed up to: $backup_name"
    echo "$backup_name"
}

# Function to restore from backup
restore_backup() {
    local backup_name="$1"
    local backup_path="$BACKUP_DIR/$backup_name"
    
    if [[ ! -d "$backup_path" ]]; then
        log_error "Backup not found: $backup_name"
        return 1
    fi
    
    log_info "Restoring from backup: $backup_name"
    
    # Stop current services
    log_info "Stopping current services..."
    docker-compose down --remove-orphans 2>/dev/null || true
    
    # Restore configuration files
    if [[ -f "$backup_path/.env" ]]; then
        cp "$backup_path/.env" "$PROJECT_DIR/"
        log_info "Restored .env file"
    fi
    
    # Restore docker-compose files
    for compose_file in docker-compose.yml docker-compose.dev.yml; do
        if [[ -f "$backup_path/$compose_file" ]]; then
            cp "$backup_path/$compose_file" "$PROJECT_DIR/"
            log_info "Restored $compose_file"
        fi
    done
    
    # Restore database if backup exists
    if [[ -f "$backup_path/database_dump.sql" ]]; then
        log_info "Restoring database..."
        
        # Start only postgres for restore
        docker-compose up -d postgres
        sleep 10
        
        # Restore database
        docker-compose exec -T postgres psql -U noxapi -d noxdb < "$backup_path/database_dump.sql" 2>/dev/null || \
            log_warning "Could not restore database (may be normal for fresh deployment)"
        
        docker-compose stop postgres
    fi
    
    # Load Docker images if available
    if [[ -f "$backup_path/images.txt" ]]; then
        log_info "Checking for Docker images to restore..."
        
        # This would require image export/import functionality
        # For now, we'll rely on rebuilding or pulling images
        log_warning "Docker image restore not implemented - will rebuild/pull as needed"
    fi
    
    log_success "Backup restored successfully"
}

# Function to perform health check after rollback
post_rollback_health_check() {
    log_info "Performing post-rollback health check..."
    
    if [[ -f "$SCRIPT_DIR/health-check.sh" ]]; then
        bash "$SCRIPT_DIR/health-check.sh" --skip-system
        return $?
    else
        log_warning "Health check script not found, performing basic check..."
        
        # Basic health check
        local max_attempts=10
        local attempt=1
        
        while [[ $attempt -le $max_attempts ]]; do
            if curl -f -s http://localhost:8082/api/v7/auth/health > /dev/null 2>&1; then
                log_success "Basic health check passed"
                return 0
            fi
            
            log_info "Health check attempt $attempt/$max_attempts failed, retrying..."
            sleep 10
            ((attempt++))
        done
        
        log_error "Health check failed after rollback"
        return 1
    fi
}

# Function to show rollback status
show_rollback_status() {
    local backup_name="$1"
    
    log_success "🔄 Rollback completed successfully!"
    echo
    log_info "Rollback Information:"
    echo "  Restored from: $backup_name"
    echo "  Timestamp: $(date '+%Y-%m-%d %H:%M:%S')"
    echo
    log_info "Current Services:"
    docker-compose ps 2>/dev/null || log_warning "Could not display service status"
    echo
    log_info "Available endpoints:"
    echo "  🌐 API: http://localhost:8082"
    echo "  📚 Documentation: http://localhost:8082/docs"
    echo
    log_info "Next steps:"
    echo "  1. Verify application functionality"
    echo "  2. Check logs: docker-compose logs -f"
    echo "  3. Monitor for any issues"
    echo
}

# Parse command line arguments
BACKUP_NAME=""
FORCE_ROLLBACK=false
SKIP_HEALTH_CHECK=false

while [[ $# -gt 0 ]]; do
    case $1 in
        -b|--backup)
            BACKUP_NAME="$2"
            shift 2
            ;;
        -f|--force)
            FORCE_ROLLBACK=true
            shift
            ;;
        --skip-health-check)
            SKIP_HEALTH_CHECK=true
            shift
            ;;
        -l|--list)
            list_backups
            exit 0
            ;;
        -h|--help)
            echo "Usage: $0 [OPTIONS]"
            echo "Options:"
            echo "  -b, --backup NAME   Backup name to restore from"
            echo "  -l, --list          List available backups"
            echo "  -f, --force         Force rollback without confirmation"
            echo "  --skip-health-check Skip health check after rollback"
            echo "  -h, --help          Show this help message"
            exit 0
            ;;
        *)
            log_error "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Interactive backup selection if not provided
if [[ -z "$BACKUP_NAME" ]]; then
    echo
    log_info "No backup specified. Please select from available backups:"
    echo
    
    if ! list_backups; then
        log_error "No backups available for rollback"
        exit 1
    fi
    
    echo
    read -p "Enter backup ID to restore (1-N): " backup_id
    
    if ! [[ "$backup_id" =~ ^[0-9]+$ ]]; then
        log_error "Invalid backup ID: $backup_id"
        exit 1
    fi
    
    local backups=($(ls -1t "$BACKUP_DIR"/ 2>/dev/null | grep "^backup_"))
    local selected_index=$((backup_id - 1))
    
    if [[ $selected_index -lt 0 || $selected_index -ge ${#backups[@]} ]]; then
        log_error "Invalid backup ID: $backup_id"
        exit 1
    fi
    
    BACKUP_NAME="${backups[$selected_index]}"
fi

# Confirmation prompt unless forced
if [[ "$FORCE_ROLLBACK" == "false" ]]; then
    echo
    log_warning "This will rollback to backup: $BACKUP_NAME"
    log_warning "Current deployment will be stopped and replaced!"
    echo
    read -p "Are you sure you want to continue? (y/N): " confirm
    
    if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
        log_info "Rollback cancelled"
        exit 0
    fi
fi

# Main rollback process
main() {
    log_info "Starting Nox API rollback process..."
    
    cd "$PROJECT_DIR"
    
    # Create backup of current state
    local current_backup=$(create_current_backup)
    log_info "Current state backed up as: $current_backup"
    
    # Perform rollback
    restore_backup "$BACKUP_NAME"
    
    # Start services
    log_info "Starting services..."
    docker-compose up -d
    
    # Wait for services to be ready
    sleep 15
    
    # Health check (unless skipped)
    if [[ "$SKIP_HEALTH_CHECK" == "false" ]]; then
        if post_rollback_health_check; then
            show_rollback_status "$BACKUP_NAME"
        else
            log_error "Rollback completed but health check failed"
            log_info "You may need to investigate the issue manually"
            exit 1
        fi
    else
        show_rollback_status "$BACKUP_NAME"
    fi
}

# Run main function
main "$@"
