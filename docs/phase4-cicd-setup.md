# CI/CD Pipeline Configuration & Guide

**Status**: ✅ READY TO USE  
**Framework**: GitHub Actions  
**Configuration File**: `.github/workflows/ci-cd-pipeline.yml`  
**Last Updated**: 2026-08-11  

---

## Overview

The CI/CD pipeline automates testing, building, and deployment of the Employee Management System using GitHub Actions. It runs automatically on every push and pull request to ensure code quality and reliability.

### Pipeline Stages

```
┌─────────────────────────────────────────────────────────────────┐
│                    COMMIT TO MAIN/DEVELOP                       │
└────────────────────────────┬────────────────────────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
    ┌─────────┐          ┌─────────┐         ┌──────────┐
    │ Backend │          │Frontend │         │Dependencies
    │ Build & │          │ Build & │         │Scanning │
    │Unit Test│          │Unit Test│         └──────────┘
    └────┬────┘          └────┬────┘
         │                    │
         └────────────┬───────┘
                      │
         ┌────────────▼────────────┐
         │  Security Scanning      │
         │  - OWASP Dependency     │
         │  - npm audit            │
         │  - SonarQube (optional) │
         └────────────┬────────────┘
                      │
         ┌────────────┼────────────┐
         │            │            │
         ▼            ▼            ▼
    ┌─────────┐  ┌────────┐  ┌──────────┐
    │Integration│ │  E2E   │  │Code Quality
    │  Tests    │ │ Tests  │  │   Check
    └─────────┬─┘ └────┬───┘  └────┬─────┘
              │        │           │
              └────────┼───────────┘
                       │
            ┌──────────▼──────────┐
            │Performance Baseline │
            │(on main branch)     │
            └──────────┬──────────┘
                       │
            ┌──────────▼──────────────┐
            │  Test Results Summary   │
            │  & Notifications        │
            └──────────┬──────────────┘
                       │
           ┌───────────▼────────────┐
           │ Deployment Approval    │
           │    (Manual Gate)       │
           └───────────┬────────────┘
                       │
            ┌──────────▼──────────┐
            │ Deploy to Staging   │
            │  (if approved)      │
            └─────────────────────┘
```

---

## How to Use

### Automatic Triggers

The pipeline runs automatically in these scenarios:

1. **Push to main or develop branch**
   ```bash
   git push origin main
   # Pipeline runs automatically
   ```

2. **Pull request to main or develop**
   ```bash
   # Create PR → GitHub Actions runs automatically
   # PR blocked if tests fail
   ```

3. **Manual Trigger**
   - Go to GitHub → Actions → CI/CD Pipeline
   - Click "Run workflow"
   - Select branch
   - Click "Run workflow"

### Monitoring Pipeline Status

**In GitHub UI**:
- Go to `Actions` tab
- View latest workflow run
- Click on run to see details
- Check individual job status

**In Command Line**:
```bash
# View workflow runs
gh workflow list
gh run list

# View specific run details
gh run view <run-id>

# Watch workflow in real-time
gh run watch <run-id>
```

---

## Pipeline Stages Details

### Stage 1: Build & Unit Tests

**Backend**:
```bash
cd backend
mvn clean package -DskipTests=false
```

- Runs all JUnit tests
- Generates test reports
- Checks code coverage (>80% target)
- Creates executable JAR

**Frontend**:
```bash
cd frontend
npm ci
npm run test -- --coverage --watchAll=false
```

- Runs Jest unit tests
- Generates coverage report
- Builds production bundle
- Uploads artifacts

**Artifacts Saved**:
- `employee-manager-1.0.0.jar`
- `frontend/build/` directory
- Test reports

### Stage 2: Security Scanning

**OWASP Dependency Check**:
```bash
mvn org.owasp:dependency-check-maven:check
```

- Scans Maven dependencies for vulnerabilities
- Checks for known CVEs
- Generates HTML report
- Fails if high/critical vulnerabilities found

**npm Audit**:
```bash
npm audit
```

- Scans npm packages for vulnerabilities
- Checks for security issues
- Can auto-fix minor issues

**Optional: SonarQube**:
```bash
# Configure SonarQube for:
# - Code quality metrics
# - Bug detection
# - Security hotspots
# - Code duplication
```

### Stage 3: Integration Tests

**Backend Integration Tests**:
```bash
mvn verify -DskipUnitTests=true
```

- Tests service layer
- Tests repository layer
- Uses H2 test database
- Validates business logic
- Runs @SpringBootTest tests

### Stage 4: E2E Tests (Cypress)

**End-to-End Workflow Tests**:
```bash
npm run test:e2e:headless
```

- Runs all 148+ Cypress tests
- Tests all 6 workflows (CRUD)
- Records videos on failure
- Takes screenshots on failure
- Validates UI interactions
- Tests data persistence

**Test Coverage**:
- Employee List (TC-E2E-001-006)
- Add Employee (TC-E2E-010-018)
- Edit Employee (TC-E2E-020-027)
- Delete Employee (TC-E2E-030-036)
- Search (TC-E2E-040-045)
- Error Handling (TC-E2E-050-055)
- Complete Workflows

### Stage 5: Code Quality

**Checkstyle** (Backend):
```bash
mvn checkstyle:check
```

- Enforces Java code style
- Validates naming conventions
- Checks formatting
- Prevents style violations

**ESLint** (Frontend):
```bash
npm run lint
```

- Enforces JavaScript style
- Detects bugs and potential issues
- Validates React best practices
- Checks accessibility

### Stage 6: Performance Tests

**Baseline Response Times** (on main branch only):
```bash
# Test GET /api/employees: <800ms target
# Test GET /api/employees/{id}: <500ms target
# Test POST /api/employees: <500ms target
```

- Single-user response times
- Validates NFR1.1 (<2 seconds)
- Captures baseline metrics
- Trends over time

### Stage 7: Test Results Summary

**Artifacts Generated**:
- Backend test report
- Frontend test report
- E2E test videos (on failure)
- E2E test screenshots (on failure)
- Security scan report
- Performance baseline report
- Code quality report

**Notifications**:
- Success: ✅ Pipeline passed
- Failure: ❌ Pipeline failed with details

### Stage 8: Deployment Approval Gate

**Manual Approval Required**:
- Review test results
- Check for any failures
- Approve or deny deployment

**Deployment (if enabled)**:
- Uploads JAR to server
- Deploys frontend build
- Runs smoke tests
- Verifies deployment

---

## Configuration & Customization

### Environment Variables

Edit `.github/workflows/ci-cd-pipeline.yml`:

```yaml
env:
  JAVA_VERSION: '17'        # Java version to use
  NODE_VERSION: '18'        # Node version to use
  MAVEN_CACHE_KEY: ...      # Maven cache key
  NPM_CACHE_KEY: ...        # NPM cache key
```

### Conditional Execution

```yaml
# Run only on main branch
if: github.ref == 'refs/heads/main'

# Run only on push (not pull request)
if: github.event_name == 'push'

# Run only on PR
if: github.event_name == 'pull_request'

# Continue on error (don't fail)
continue-on-error: true

# Allow manual trigger
workflow_dispatch
```

### Modify Test Coverage

```yaml
# Change test stage requirements
needs: [ build-backend, build-frontend, security-scan ]

# Skip optional stages
if: false  # Disables stage

# Change timeout
timeout-minutes: 20
```

### Add Secrets

Store sensitive data in GitHub:

1. Go to Repository → Settings → Secrets and variables → Actions
2. Create new secret:
   - `SONAR_TOKEN`: SonarQube authentication
   - `SLACK_WEBHOOK`: Slack notifications
   - `DEPLOY_KEY`: Deployment server key
   - `DB_PASSWORD`: Database password (if needed)

Use in workflow:
```yaml
- name: Use secret
  run: echo ${{ secrets.SECRET_NAME }}
```

---

## Understanding Test Results

### Successful Pipeline

```
✅ Backend Build & Unit Tests
✅ Frontend Build & Unit Tests
✅ Security Scanning
✅ Integration Tests
✅ E2E Tests
✅ Code Quality
✅ Performance Tests
✅ Test Results Summary

Result: ALL PASSED - Ready to merge/deploy
```

### Failed Test Checks

**Backend Build Failed**:
- Check Java compilation errors
- Fix code issues
- Re-run tests locally

**Unit Tests Failed**:
- Review failed test output
- Check test logs
- Run locally: `mvn test`

**E2E Tests Failed**:
- Check Cypress videos/screenshots
- Review error messages
- Run locally: `npm run test:e2e`

**Security Scan Failed**:
- Review OWASP report
- Check for CVEs in dependencies
- Update vulnerable packages
- Run: `npm audit fix`

---

## Troubleshooting

### Pipeline Hangs

**Solution**:
- Set reasonable timeouts (default: 60 min)
- Check for infinite loops
- Review runner resource usage
- Cancel and re-run if stuck

### Tests Fail Locally But Pass in CI

**Solution**:
- Check environment differences
- Verify Java/Node versions match
- Check file system paths
- Use same commands as CI

### Cache Issues

**Clear Cache**:
1. Go to Actions → Workflows
2. Click "Clear all caches"
3. Re-run workflow

```bash
# Or manually clear
gh cache list -L <repo> 
gh cache delete -N <cache-name>
```

### Rate Limiting

**GitHub Actions Rate Limits**:
- 1,000 API requests per 3,600 seconds
- Parallelization helps
- Check Actions billing

---

## Performance Optimization

### Speed Up Pipeline

1. **Parallel Jobs**:
   ```yaml
   needs: build-backend  # Sequential
   needs: [ build-backend, build-frontend ]  # Parallel
   ```

2. **Use Caching**:
   ```yaml
   cache: maven  # Caches Maven dependencies
   cache: npm    # Caches npm packages
   ```

3. **Skip Unnecessary Stages**:
   ```yaml
   if: github.event_name == 'push'  # Skip on PR
   ```

4. **Reduce Test Coverage** (dev only):
   ```bash
   npm run test -- --testPathPattern="unit"  # Only unit tests
   ```

### Current Pipeline Time

- Backend Build: ~2-3 min
- Frontend Build: ~2-3 min
- Security Scan: ~2-3 min
- Integration Tests: ~3-5 min
- E2E Tests: ~5-10 min
- Code Quality: ~1-2 min
- Performance Tests: ~2-3 min

**Total**: ~20-30 minutes (depending on system load)

---

## Deployment Configuration

### Enable Staging Deployment

Edit `.github/workflows/ci-cd-pipeline.yml`:

```yaml
# Change line (currently false):
if: github.ref == 'refs/heads/main' && true  # Enable

# Add deployment steps:
- name: Deploy to staging environment
  run: |
    ssh -i ${{ secrets.DEPLOY_KEY }} user@staging-server
    # Copy files
    # Restart services
    # Run smoke tests
```

### Deployment Script Template

Create `scripts/deploy.sh`:

```bash
#!/bin/bash

set -e  # Exit on error

DEPLOY_USER="deploy"
DEPLOY_HOST="staging.example.com"
DEPLOY_PATH="/opt/app"

echo "🚀 Starting deployment..."

# Upload JAR
scp -i ~/.ssh/deploy_key \
  employee-manager-1.0.0.jar \
  ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/

# Upload frontend
scp -r frontend/build/* \
  ${DEPLOY_USER}@${DEPLOY_HOST}:/var/www/html/

# Stop old service
ssh -i ~/.ssh/deploy_key ${DEPLOY_USER}@${DEPLOY_HOST} \
  "systemctl stop employee-manager || true"

# Start new service
ssh -i ~/.ssh/deploy_key ${DEPLOY_USER}@${DEPLOY_HOST} \
  "cd ${DEPLOY_PATH} && java -jar employee-manager-1.0.0.jar &"

# Wait for startup
sleep 10

# Smoke tests
curl -f http://${DEPLOY_HOST}:8080/api/employees || {
  echo "❌ Deployment failed"
  exit 1
}

echo "✅ Deployment successful"
```

---

## Notifications & Alerts

### Slack Integration

Add to workflow:

```yaml
- name: Notify Slack on failure
  if: failure()
  uses: slackapi/slack-github-action@v1
  with:
    payload: |
      {
        "text": "❌ Pipeline failed!",
        "channel": "#deployments",
        "attachments": [
          {
            "color": "danger",
            "fields": [
              { "title": "Job", "value": "${{ job.status }}" },
              { "title": "Branch", "value": "${{ github.ref }}" }
            ]
          }
        ]
      }
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

### Email Notifications

GitHub automatically sends email on:
- Pipeline failure
- Push to main
- After 24 hours without running

---

## Maintenance & Updates

### Regular Tasks

**Weekly**:
- Review test coverage trends
- Check for new dependency updates
- Monitor pipeline execution time

**Monthly**:
- Update dependencies
- Review security alerts
- Optimize pipeline performance

**Quarterly**:
- Full security audit
- Performance profiling
- Update CI/CD tools

### Update CI/CD

```bash
# Update GitHub Actions version
git log --oneline | grep -i "actions"

# Upgrade workflow steps
# Example: actions/checkout@v2 → actions/checkout@v3

# Test in development branch before merging
```

---

## Best Practices

### ✅ DO

- ✅ Run tests locally before pushing
- ✅ Keep tests fast (parallel execution)
- ✅ Use meaningful commit messages
- ✅ Create PRs for non-main branches
- ✅ Review test results before merge
- ✅ Cache dependencies
- ✅ Document custom scripts

### ❌ DON'T

- ❌ Ignore pipeline failures
- ❌ Commit directly to main
- ❌ Disable required checks
- ❌ Use sleep/wait instead of proper waiting
- ❌ Hardcode secrets in workflows
- ❌ Leave flaky tests unresolved
- ❌ Skip security scanning

---

## Example: Running Specific Tests

### Run Only Unit Tests

```bash
# Locally
mvn test                    # Backend
npm run test                # Frontend

# Skip E2E and integration
# Edit workflow: if: false on those stages
```

### Run Only Security Scan

```bash
# Locally
mvn org.owasp:dependency-check-maven:check
npm audit

# Manually trigger: Disable other stages in workflow
```

### Run Only E2E Tests

```bash
# Locally
npm run test:e2e:headless

# Requires backend running
java -jar target/employee-manager-1.0.0.jar &
```

---

## GitHub Actions Marketplace Extensions

Useful actions to consider adding:

- **Code Coverage**: `codecov/codecov-action`
- **Test Reports**: `dorny/test-reporter`
- **Deployment**: `appleboy/ssh-action`
- **Docker**: `docker/build-push-action`
- **Artifact Upload**: `actions/upload-artifact`
- **Notifications**: `slackapi/slack-github-action`
- **Status Check**: `gor

mflock/status-check-action`

---

## Support & Documentation

### Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Actions Best Practices](https://docs.github.com/en/actions/guides)
- [Workflow Syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [Security in Actions](https://docs.github.com/en/actions/security-guides)

### Getting Help

1. Check workflow logs in GitHub UI
2. Run tests locally to reproduce
3. Review workflow YAML syntax
4. Check GitHub Actions docs
5. Contact CI/CD lead or DevOps team

---

**Document Version**: 1.0  
**Last Updated**: 2026-08-11  
**Status**: ✅ Ready for Production Use  
**Maintenance**: Reviewed Monthly
