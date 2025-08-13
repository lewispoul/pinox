#!/bin/bash
# Nox API v7.0.0 - Backup Script
# Automated backup with retention management

set -e

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
BACKUP_DIR="${BACKUP_DIR:-$PROJECT_DIR/backups}"
RETENTION_DAYS="${RETENTION_DAYS:-30}"
MAX_BACKUPS="${MAX_BACKUPS:-10}"

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

# Function to create backup directory
setup_backup_directory() {
    if [[ ! -d "$BACKUP_DIR" ]]; then
        mkdir -p "$BACKUP_DIR"
        log_info "Created backup directory: $BACKUP_DIR"
    fi
    
    # Ensure proper permissions
    chmod 750 "$BACKUP_DIR"
}

# Function to generate backup name
generate_backup_name() {
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local backup_type="${1:-manual}"
    echo "backup_${backup_type}_${timestamp}"
}

# Function to backup configuration files
backup_configuration() {
    local backup_path="$1"
    
    log_info "Backing up configuration files..."
    
    # Environment files
    for env_file in .env .env.production .env.development; do
        if [[ -f "$PROJECT_DIR/$env_file" ]]; then
            cp "$PROJECT_DIR/$env_file" "$backup_path/"
            log_info "Backed up $env_file"
        fi
    done
    
    # Docker Compose files
    for compose_file in docker-compose.yml docker-compose.dev.yml docker-compose.prod.yml; do
        if [[ -f "$PROJECT_DIR/$compose_file" ]]; then
            cp "$PROJECT_DIR/$compose_file" "$backup_path/"
            log_info "Backed up $compose_file"
        fi
    done
    
    # Dockerfiles
    for dockerfile in Dockerfile Dockerfile.dev Dockerfile.prod; do
        if [[ -f "$PROJECT_DIR/$dockerfile" ]]; then
            cp "$PROJECT_DIR/$dockerfile" "$backup_path/"
            log_info "Backed up $dockerfile"
        fi
    done
    
    # Requirements files
    for req_file in requirements.txt requirements-dev.txt; do
        if [[ -f "$PROJECT_DIR/$req_file" ]]; then
            cp "$PROJECT_DIR/$req_file" "$backup_path/"
            log_info "Backed up $req_file"
        fi
    done
    
    # Nginx/Caddy configuration
    if [[ -d "$PROJECT_DIR/deploy" ]]; then
        cp -r "$PROJECT_DIR/deploy" "$backup_path/"
        log_info "Backed up deployment configuration"
    fi
    
    # GitHub Actions workflows
    if [[ -d "$PROJECT_DIR/.github" ]]; then
        cp -r "$PROJECT_DIR/.github" "$backup_path/"
        log_info "Backed up GitHub Actions workflows"
    fi
}

# Function to backup database
backup_database() {
    local backup_path="$1"
    
    log_info "Backing up database..."
    
    # Check if PostgreSQL container is running
    if docker-compose ps postgres 2>/dev/null | grep -q "Up"; then
        log_info "PostgreSQL container is running, creating database dump..."
        
        # Create database dump
        docker-compose exec -T postgres pg_dump -U noxapi -d noxdb --clean --if-exists > "$backup_path/database_dump.sql" || {
            log_warning "Could not create database dump (container may not be ready)"
            return 1
        }
        
        # Compress the dump
        gzip "$backup_path/database_dump.sql"
        log_success "Database dump created and compressed"
        
        # Get database schema for reference
        docker-compose exec -T postgres pg_dump -U noxapi -d noxdb --schema-only > "$backup_path/schema_dump.sql" 2>/dev/null || true
        
        return 0
    else
        log_warning "PostgreSQL container is not running - skipping database backup"
        return 1
    fi
}

# Function to backup application code
backup_application_code() {
    local backup_path="$1"
    
    log_info "Backing up application code..."
    
    # Create code directory in backup
    mkdir -p "$backup_path/code"
    
    # Copy Python application files
    if [[ -d "$PROJECT_DIR/api" ]]; then
        cp -r "$PROJECT_DIR/api" "$backup_path/code/"
        log_info "Backed up API code"
    fi
    
    # Copy test files
    if [[ -d "$PROJECT_DIR/tests" ]]; then
        cp -r "$PROJECT_DIR/tests" "$backup_path/code/"
        log_info "Backed up test files"
    fi
    
    # Copy scripts
    if [[ -d "$PROJECT_DIR/scripts" ]]; then
        cp -r "$PROJECT_DIR/scripts" "$backup_path/code/"
        log_info "Backed up scripts"
    fi
    
    # Copy documentation
    for doc_file in README.md CHANGELOG.md LICENSE *.md; do
        if [[ -f "$PROJECT_DIR/$doc_file" ]]; then
            cp "$PROJECT_DIR/$doc_file" "$backup_path/code/"
        fi
    done
}

# Function to backup Docker images
backup_docker_images() {
    local backup_path="$1"
    
    log_info "Backing up Docker image information..."
    
    # Save image information
    docker image ls --format "table {{.Repository}}:{{.Tag}}\t{{.ID}}\t{{.Size}}\t{{.CreatedAt}}" | \
        grep -E "(nox-api|postgres|redis)" > "$backup_path/docker_images.txt" 2>/dev/null || true
    
    # Export nox-api images (optional - can be large)
    if [[ "$EXPORT_IMAGES" == "true" ]]; then
        log_info "Exporting Docker images (this may take a while)..."
        
        local images=($(docker image ls --format "{{.Repository}}:{{.Tag}}" | grep "nox-api"))
        
        for image in "${images[@]}"; do
            local safe_name=$(echo "$image" | tr ':/' '_')
            docker save "$image" | gzip > "$backup_path/${safe_name}.tar.gz" && \
                log_info "Exported image: $image" || \
                log_warning "Failed to export image: $image"
        done
    fi
}

# Function to create backup metadata
create_backup_metadata() {
    local backup_path="$1"
    local backup_name="$2"
    local backup_type="$3"
    
    log_info "Creating backup metadata..."
    
    cat > "$backup_path/metadata.json" <<EOF
{
    "backup_name": "$backup_name",
    "backup_type": "$backup_type",
    "timestamp": "$(date -Iseconds)",
    "created_by": "$(whoami)",
    "hostname": "$(hostname)",
    "git_info": {
        "commit": "$(git rev-parse HEAD 2>/dev/null || echo 'unknown')",
        "branch": "$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo 'unknown')",
        "dirty": $(git diff --quiet 2>/dev/null && echo 'false' || echo 'true'),
        "remote_url": "$(git remote get-url origin 2>/dev/null || echo 'unknown')"
    },
    "system_info": {
        "os": "$(uname -s)",
        "kernel": "$(uname -r)",
        "architecture": "$(uname -m)",
        "python_version": "$(python3 --version 2>/dev/null || echo 'unknown')",
        "docker_version": "$(docker --version 2>/dev/null || echo 'unknown')"
    },
    "backup_contents": [
        $(find "$backup_path" -type f -name "*" | grep -v metadata.json | sed 's|^.*/||' | sort | sed 's/^/"/' | sed 's/$/"/' | paste -sd, -)
    ],
    "backup_size_bytes": $(du -sb "$backup_path" | cut -f1),
    "retention_info": {
        "retention_days": $RETENTION_DAYS,
        "max_backups": $MAX_BACKUPS
    }
}
EOF
    
    log_success "Backup metadata created"
}

# Function to clean old backups
cleanup_old_backups() {
    log_info "Cleaning up old backups..."
    
    # Remove backups older than retention period
    find "$BACKUP_DIR" -name "backup_*" -type d -mtime +$RETENTION_DAYS -exec rm -rf {} + 2>/dev/null || true
    
    # Keep only the most recent backups based on MAX_BACKUPS
    local backups=($(ls -1t "$BACKUP_DIR"/ 2>/dev/null | grep "^backup_" || true))
    
    if [[ ${#backups[@]} -gt $MAX_BACKUPS ]]; then
        log_info "Found ${#backups[@]} backups, keeping $MAX_BACKUPS most recent"
        
        for (( i=$MAX_BACKUPS; i<${#backups[@]}; i++ )); do
            local backup_to_remove="${backups[$i]}"
            rm -rf "$BACKUP_DIR/$backup_to_remove"
            log_info "Removed old backup: $backup_to_remove"
        done
    fi
    
    log_success "Cleanup completed"
}

# Function to verify backup integrity
verify_backup() {
    local backup_path="$1"
    
    log_info "Verifying backup integrity..."
    
    local errors=0
    
    # Check if essential files exist
    local essential_files=("metadata.json")
    
    for file in "${essential_files[@]}"; do
        if [[ ! -f "$backup_path/$file" ]]; then
            log_error "Missing essential file: $file"
            ((errors++))
        fi
    done
    
    # Verify database dump if it exists
    if [[ -f "$backup_path/database_dump.sql.gz" ]]; then
        if gzip -t "$backup_path/database_dump.sql.gz" 2>/dev/null; then
            log_success "Database dump is valid"
        else
            log_error "Database dump is corrupted"
            ((errors++))
        fi
    fi
    
    # Check backup size (should be > 0)
    local backup_size=$(du -sb "$backup_path" | cut -f1)
    if [[ $backup_size -lt 1024 ]]; then
        log_warning "Backup size seems very small: $backup_size bytes"
    else
        log_success "Backup size: $(numfmt --to=iec $backup_size)"
    fi
    
    if [[ $errors -eq 0 ]]; then
        log_success "Backup verification passed"
        return 0
    else
        log_error "Backup verification failed with $errors errors"
        return 1
    fi
}

# Function to list existing backups
list_backups() {
    log_info "Existing backups:"
    echo
    
    if [[ ! -d "$BACKUP_DIR" ]]; then
        log_warning "No backup directory found"
        return 1
    fi
    
    local backups=($(ls -1t "$BACKUP_DIR"/ 2>/dev/null | grep "^backup_" || true))
    
    if [[ ${#backups[@]} -eq 0 ]]; then
        log_info "No backups found"
        return 0
    fi
    
    echo "Name                           | Size    | Created             | Type"
    echo "-------------------------------|---------|---------------------|--------"
    
    for backup in "${backups[@]}"; do
        local backup_path="$BACKUP_DIR/$backup"
        local size=$(du -sh "$backup_path" 2>/dev/null | cut -f1 || echo "?")
        local created=$(stat -c %y "$backup_path" 2>/dev/null | cut -d. -f1 || echo "unknown")
        local type=$(echo "$backup" | cut -d_ -f2)
        
        printf "%-30s | %-7s | %-19s | %-8s\n" "$backup" "$size" "$created" "$type"
    done
    
    echo
    log_info "Total backups: ${#backups[@]}"
}

# Parse command line arguments
BACKUP_TYPE="manual"
EXPORT_IMAGES=false
SKIP_DATABASE=false
SKIP_CODE=false
QUIET=false

while [[ $# -gt 0 ]]; do
    case $1 in
        -t|--type)
            BACKUP_TYPE="$2"
            shift 2
            ;;
        --export-images)
            EXPORT_IMAGES=true
            shift
            ;;
        --skip-database)
            SKIP_DATABASE=true
            shift
            ;;
        --skip-code)
            SKIP_CODE=true
            shift
            ;;
        -q|--quiet)
            QUIET=true
            shift
            ;;
        -l|--list)
            list_backups
            exit 0
            ;;
        --retention-days)
            RETENTION_DAYS="$2"
            shift 2
            ;;
        --max-backups)
            MAX_BACKUPS="$2"
            shift 2
            ;;
        -h|--help)
            echo "Usage: $0 [OPTIONS]"
            echo "Options:"
            echo "  -t, --type TYPE     Backup type (manual/scheduled/pre-deploy)"
            echo "  --export-images     Export Docker images (increases backup size)"
            echo "  --skip-database     Skip database backup"
            echo "  --skip-code         Skip application code backup"
            echo "  -q, --quiet         Minimize output"
            echo "  -l, --list          List existing backups"
            echo "  --retention-days N  Days to keep backups (default: 30)"
            echo "  --max-backups N     Maximum backups to keep (default: 10)"
            echo "  -h, --help          Show this help message"
            exit 0
            ;;
        *)
            log_error "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Redirect output if quiet mode
if [[ "$QUIET" == "true" ]]; then
    exec > /dev/null 2>&1
fi

# Main backup process
main() {
    log_info "Starting Nox API v7.0.0 backup process..."
    log_info "Backup type: $BACKUP_TYPE"
    
    cd "$PROJECT_DIR"
    
    # Setup backup directory
    setup_backup_directory
    
    # Generate backup name and path
    local backup_name=$(generate_backup_name "$BACKUP_TYPE")
    local backup_path="$BACKUP_DIR/$backup_name"
    
    log_info "Creating backup: $backup_name"
    mkdir -p "$backup_path"
    
    # Perform backup operations
    backup_configuration "$backup_path"
    
    if [[ "$SKIP_DATABASE" == "false" ]]; then
        backup_database "$backup_path"
    fi
    
    if [[ "$SKIP_CODE" == "false" ]]; then
        backup_application_code "$backup_path"
    fi
    
    backup_docker_images "$backup_path"
    
    # Create metadata
    create_backup_metadata "$backup_path" "$backup_name" "$BACKUP_TYPE"
    
    # Verify backup
    if verify_backup "$backup_path"; then
        log_success "✅ Backup completed successfully: $backup_name"
        
        # Show backup info
        local backup_size=$(du -sh "$backup_path" | cut -f1)
        log_info "Backup size: $backup_size"
        log_info "Backup location: $backup_path"
        
    else
        log_error "❌ Backup verification failed"
        exit 1
    fi
    
    # Cleanup old backups
    cleanup_old_backups
    
    # Final summary
    if [[ "$QUIET" == "false" ]]; then
        echo
        log_success "🎯 Backup process completed!"
        echo
        list_backups
    fi
}

# Run main function
main "$@"
