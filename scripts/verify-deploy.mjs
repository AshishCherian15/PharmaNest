const args = new Set(process.argv.slice(2));
const checkHealth = args.has('--health');

const requiredEnv = ['DATABASE_URL', 'AUTH_SECRET', 'AUTH_DEFAULT_PASSWORD'];
const supabaseEnv = ['DIRECT_URL', 'PRISMA_SCHEMA_PATH'];

function logResult(label, ok, details = '') {
  const prefix = ok ? '[ok]' : '[missing]';
  console.log(`${prefix} ${label}${details ? `: ${details}` : ''}`);
}

let hasError = false;

for (const key of requiredEnv) {
  const value = process.env[key];
  const ok = Boolean(value && value.trim().length > 0);
  logResult(key, ok);
  if (!ok) hasError = true;
}

const databaseUrl = process.env.DATABASE_URL || '';
const looksLikePostgres = databaseUrl.startsWith('postgres://') || databaseUrl.startsWith('postgresql://');

if (looksLikePostgres) {
  for (const key of supabaseEnv) {
    const value = process.env[key];
    const ok = Boolean(value && value.trim().length > 0);
    logResult(key, ok, 'required for postgres deployment');
    if (!ok) hasError = true;
  }
}

if (!checkHealth) {
  if (hasError) {
    console.error('Deployment verification failed due to missing environment variables.');
    process.exit(1);
  }

  console.log('Deployment environment verification passed.');
  process.exit(0);
}

const healthUrl = process.env.HEALTHCHECK_URL || 'http://localhost:9002/api/health';

try {
  const response = await fetch(healthUrl);
  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    console.error(`Health check failed: ${response.status}`);
    console.error(body);
    process.exit(1);
  }

  logResult('HEALTHCHECK_URL', true, healthUrl);
  console.log('Health response:', body);

  if (hasError) {
    console.error('Health check passed but environment verification failed.');
    process.exit(1);
  }

  console.log('Deployment and health verification passed.');
} catch (error) {
  console.error(`Health check request failed for ${healthUrl}`);
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
