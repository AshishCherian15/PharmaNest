import { apiError, apiSuccess } from '@/lib/api-response';
import { prisma } from '@/lib/prisma';
import { isDemoModeEnabled } from '@/lib/demo-mode';

export async function GET() {
  if (isDemoModeEnabled()) {
    return apiSuccess(
      {
        status: 'ok',
        db: 'demo-bypass',
        env: 'demo-mode',
        timestamp: new Date().toISOString(),
      },
      200
    );
  }

  try {
    await prisma.$queryRaw`SELECT 1`;

    const envOk = Boolean(process.env.DATABASE_URL) && Boolean(process.env.AUTH_SECRET);

    return apiSuccess(
      {
        status: 'ok',
        db: 'up',
        env: envOk ? 'configured' : 'partial',
        timestamp: new Date().toISOString(),
      },
      200
    );
  } catch (error) {
    return apiError(
      'Database health check failed',
      503,
      'DB_UNAVAILABLE',
      process.env.NODE_ENV === 'development'
        ? { message: error instanceof Error ? error.message : 'Unknown error' }
        : undefined
    );
  }
}
