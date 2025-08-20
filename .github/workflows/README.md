# GitHub Actions Workflows

This directory contains the GitHub Actions workflows for the Nox project.

## Active Workflows

### 🔧 docker-build.yml
**Purpose**: Primary CI/CD pipeline for building, testing, and publishing Docker images
- **Triggers**: Push to main/develop branches, pull requests to main, version tags
- **Jobs**:
  - `test`: Runs unit tests with PostgreSQL and Redis services
  - `build`: Builds multi-architecture Docker images (linux/amd64, linux/arm64)
  - `security-scan`: Performs Trivy security scanning on built images
- **Outputs**: Docker images pushed to GitHub Container Registry (GHCR)

### 🚀 cd.yml
**Purpose**: Continuous Deployment pipeline
- **Triggers**: Completion of "Docker Build and Deploy" workflow, manual dispatch
- **Jobs**:
  - `check-readiness`: Validates deployment prerequisites
  - `deploy-staging`: Deploys to staging environment with health checks
  - `deploy-production`: Deploys to production with validation
  - `monitor`: Post-deployment monitoring and validation
- **Dependencies**: Waits for successful completion of docker-build.yml

### 🤖 agent-nightly.yml
**Purpose**: Automated agent execution for maintenance tasks
- **Triggers**: Daily cron schedule (3 AM UTC), manual dispatch
- **Jobs**:
  - `agent`: Runs the Nox agent for automated maintenance and tasks
- **Requirements**: OPENAI_API_KEY secret must be configured

## Workflow Dependencies

```
docker-build.yml (CI) → cd.yml (CD) → Production Deployment
                    ↓
              agent-nightly.yml (Maintenance)
```

## Configuration Requirements

### Secrets Required
- `OPENAI_API_KEY`: For agent workflow functionality
- `GITHUB_TOKEN`: Automatically provided by GitHub Actions

### Repository Settings
- Container Registry: Configured to use GitHub Container Registry (ghcr.io)
- Branch Protection: Main branch should be protected to ensure workflows run on PRs

## Recent Cleanup

**2025-08-20**: Removed duplicate workflows to eliminate CI/CD pipeline conflicts:
- ❌ Removed `ci.yml` (duplicate of docker-build.yml functionality)
- ❌ Removed `ci-fixed.yml` (duplicate of ci.yml)
- ✅ Kept `docker-build.yml` as primary CI pipeline (referenced by CD workflow)
- ✅ Kept `cd.yml` as deployment pipeline
- ✅ Kept `agent-nightly.yml` for automated maintenance

This cleanup eliminates workflow duplication while maintaining all required functionality.