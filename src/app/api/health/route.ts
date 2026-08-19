import { NextResponse } from 'next/server';
import { getEnvironment, getAppVersion } from '@/lib/environment';

export const dynamic = 'force-dynamic';

/**
 * Health check endpoint.
 * GET /api/health
 */
export async function GET() {
  const health = {
    status: 'ok',
    version: getAppVersion(),
    environment: getEnvironment(),
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  };
  return NextResponse.json(health, { status: 200 });
}
