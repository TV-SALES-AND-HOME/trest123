/**
 * Environment utility module.
 * Provides typed, validated access to environment variables.
 */

export type Environment = 'development' | 'staging' | 'production' | 'test';

export interface AppEnvironment {
  name: string;
  version: string;
  environment: Environment;
  appUrl: string;
  apiUrl: string;
  isDevelopment: boolean;
  isStaging: boolean;
  isProduction: boolean;
}

/** Returns the current environment label. */
export function getEnvironment(): Environment {
  const env = process.env.NEXT_PUBLIC_ENVIRONMENT || process.env.NODE_ENV || 'development';
  const validEnvironments: Environment[] = ['development', 'staging', 'production', 'test'];
  if (validEnvironments.includes(env as Environment)) {
    return env as Environment;
  }
  return 'development';
}

/** Returns the application version. */
export function getAppVersion(): string {
  return process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0';
}

/** Returns the application name. */
export function getAppName(): string {
  return process.env.NEXT_PUBLIC_APP_NAME || 'TV SALES & HOME Demo';
}

/** Returns the full application environment configuration. */
export function getAppEnvironment(): AppEnvironment {
  const environment = getEnvironment();
  return {
    name: getAppName(),
    version: getAppVersion(),
    environment,
    appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
    isDevelopment: environment === 'development',
    isStaging: environment === 'staging',
    isProduction: environment === 'production',
  };
}
