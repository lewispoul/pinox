# CONNECTING_NOX_IAM.md

## Integration Strategy: Option A - Separate Repositories with SDK/API Integration

### Overview
Keep NOX and IAM 2.0 projects in separate repositories and integrate them through:
- **SDK Packages**: TypeScript and Python SDKs for IAM 2.0
- **API Integration**: Direct API calls between services
- **Shared Authentication**: OAuth2 flow coordination
- **Package Management**: GitHub Packages for SDK distribution

### Architecture
```
NOX Repository (nox-api-src/)
├── Interactive Docs (docs-interactive/)
├── API Server (FastAPI)
└── SDK Integration (IAM client)

IAM Repository (separate)
├── Backend Services
├── SDK Generation (TS/Python)
└── Package Publishing
```

### Integration Points
1. **SDK Generation**: IAM generates SDKs published to GitHub Packages
2. **NOX Integration**: NOX imports IAM SDKs via package manager
3. **Live Explorer**: NOX adds IAM API section using imported SDKs
4. **Authentication**: Coordinated OAuth2 flows between services

### Implementation Steps
1. Complete NOX P3.3 (M9.4-M9.6)
2. Publish IAM SDKs to GitHub Packages
3. Add IAM API section to NOX Live Explorer
4. Connect IAM dev sandbox to NOX platform
5. Begin M10 Jobs Core with IAM integration in mind

This approach maintains clear separation of concerns while enabling deep integration through well-defined APIs and SDK packages.
