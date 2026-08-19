import { describe, it, expect, afterEach } from 'vitest';
import {
  getEnvironment,
  getAppVersion,
  getAppName,
  getAppEnvironment,
  type Environment,
} from '@/lib/environment';

describe('getEnvironment()', () => {
  const originalEnv = { ...process.env };
  afterEach(() => { process.env = { ...originalEnv }; });

  it('returns development by default when no env vars are set', () => {
    delete process.env.NEXT_PUBLIC_ENVIRONMENT;
    delete (process.env as Record<string, string | undefined>).NODE_ENV;
    expect(getEnvironment()).toBe('development');
  });

  it('returns the correct environment when NEXT_PUBLIC_ENVIRONMENT is set', () => {
    const environments: Environment[] = ['development', 'staging', 'production', 'test'];
    for (const env of environments) {
      process.env.NEXT_PUBLIC_ENVIRONMENT = env;
      expect(getEnvironment()).toBe(env);
    }
  });

  it('falls back to development for unknown environment values', () => {
    process.env.NEXT_PUBLIC_ENVIRONMENT = 'unknown-env';
    expect(getEnvironment()).toBe('development');
  });
});

describe('getAppVersion()', () => {
  const originalEnv = { ...process.env };
  afterEach(() => { process.env = { ...originalEnv }; });

  it('returns 1.0.0 as default version', () => {
    delete process.env.NEXT_PUBLIC_APP_VERSION;
    expect(getAppVersion()).toBe('1.0.0');
  });

  it('returns the version from NEXT_PUBLIC_APP_VERSION', () => {
    process.env.NEXT_PUBLIC_APP_VERSION = '2.5.1';
    expect(getAppVersion()).toBe('2.5.1');
  });
});

describe('getAppName()', () => {
  const originalEnv = { ...process.env };
  afterEach(() => { process.env = { ...originalEnv }; });

  it('returns the default app name', () => {
    delete process.env.NEXT_PUBLIC_APP_NAME;
    expect(getAppName()).toBe('TV SALES & HOME Demo');
  });

  it('returns the custom app name from env', () => {
    process.env.NEXT_PUBLIC_APP_NAME = 'Custom Name';
    expect(getAppName()).toBe('Custom Name');
  });
});

describe('getAppEnvironment()', () => {
  const originalEnv = { ...process.env };
  afterEach(() => { process.env = { ...originalEnv }; });

  it('returns a complete AppEnvironment object with staging', () => {
    process.env.NEXT_PUBLIC_ENVIRONMENT = 'staging';
    const result = getAppEnvironment();
    expect(result).toMatchObject({
      environment: 'staging',
      isStaging: true,
      isDevelopment: false,
      isProduction: false,
    });
    expect(result.name).toBeTruthy();
    expect(result.version).toBeTruthy();
  });

  it('correctly sets isDevelopment flag', () => {
    process.env.NEXT_PUBLIC_ENVIRONMENT = 'development';
    const result = getAppEnvironment();
    expect(result.isDevelopment).toBe(true);
    expect(result.isStaging).toBe(false);
    expect(result.isProduction).toBe(false);
  });

  it('correctly sets isProduction flag', () => {
    process.env.NEXT_PUBLIC_ENVIRONMENT = 'production';
    const result = getAppEnvironment();
    expect(result.isProduction).toBe(true);
    expect(result.isDevelopment).toBe(false);
    expect(result.isStaging).toBe(false);
  });
});
