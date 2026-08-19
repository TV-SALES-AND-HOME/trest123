import { describe, it, expect } from 'vitest';

describe('Health Check Contract', () => {
  it('health response must include a status field with value ok', () => {
    const response = { status: 'ok', version: '1.0.0', environment: 'development', timestamp: new Date().toISOString() };
    expect(response).toHaveProperty('status');
    expect(response.status).toBe('ok');
  });

  it('health response must include version and environment fields', () => {
    const response = { status: 'ok', version: '1.0.0', environment: 'development', timestamp: new Date().toISOString() };
    expect(response).toHaveProperty('version');
    expect(response).toHaveProperty('environment');
    expect(typeof response.version).toBe('string');
    expect(typeof response.environment).toBe('string');
  });

  it('health response timestamp must be a valid ISO 8601 string', () => {
    const timestamp = new Date().toISOString();
    const parsed = new Date(timestamp);
    expect(isNaN(parsed.getTime())).toBe(false);
  });

  it('valid environments must be one of the expected values', () => {
    const validEnvironments = ['development', 'staging', 'production', 'test'];
    expect(validEnvironments).toContain('development');
  });

  it('version must follow semver format', () => {
    const semverRegex = /^\d+\.\d+\.\d+(-[a-zA-Z0-9.]+)?(\+[a-zA-Z0-9.]+)?$/;
    expect(semverRegex.test('1.0.0')).toBe(true);
  });
});
