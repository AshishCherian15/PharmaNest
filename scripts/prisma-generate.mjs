const schemaPath = process.env.PRISMA_SCHEMA_PATH?.trim() || 'prisma/schema.prisma';

const { spawnSync } = await import('node:child_process');

const command = `npx prisma generate --schema ${schemaPath}`;
const result = spawnSync(command, {
  stdio: 'inherit',
  shell: true,
});

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}
