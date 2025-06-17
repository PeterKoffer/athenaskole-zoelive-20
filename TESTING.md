# Testing Guide

This project includes comprehensive testing setup with unit tests, integration tests, and end-to-end tests.

## Test Structure

```
src/test/
├── setup.ts              # Test environment setup
├── unit/                 # Unit tests
│   ├── App.test.tsx      # App component tests
│   └── gameSystem.test.ts # Game system tests
└── integration/          # Integration tests
    ├── supabase.test.ts      # Supabase integration tests
    └── questionSystem.test.ts # Question system integration tests

playwright/
└── tests/                # End-to-end tests
    ├── home.spec.ts      # Home page E2E tests
    └── dashboards.spec.ts # Dashboard E2E tests
```

## Running Tests

### Unit Tests
```bash
npm run test:unit
```

### Integration Tests
```bash
npm run test:integration
```

### End-to-End Tests
```bash
npm run test:e2e
```

### All Tests with Coverage
```bash
npm run test:coverage
```

### Watch Mode (for development)
```bash
npm run test:watch
```

## E2E Testing with Playwright

The E2E tests are configured to run against the staging environment using the `STAGING_APP_URL` environment variable. 

### Local Development
For local development, tests will automatically start a dev server on `http://localhost:8080`.

### CI/CD
In CI/CD, set the `STAGING_APP_URL` secret in GitHub to point to your deployed staging environment.

## Test Configuration

- **Vitest**: Used for unit and integration tests
- **Playwright**: Used for E2E testing across multiple browsers
- **Testing Library**: Used for component testing utilities
- **Jest DOM**: Provides additional matchers for DOM testing

## Coverage Reports

Coverage reports are generated in the `coverage/` directory and include:
- HTML report: `coverage/index.html`
- JSON report: `coverage/coverage.json`

## Artifacts

Test results are saved as artifacts in CI/CD:
- Unit test results and coverage
- Integration test results
- Playwright test reports with screenshots and videos on failure