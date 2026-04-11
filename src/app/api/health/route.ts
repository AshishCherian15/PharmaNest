import { apiError, apiSuccess } from '@/lib/api-response';
import { prisma } from '@/lib/prisma';

export async function GET() {
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
