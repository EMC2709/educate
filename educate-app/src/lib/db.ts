import { neon } from '@neondatabase/serverless';

// Lazily initialise — avoids crashing at module load when DATABASE_URL is absent.
// Routes that use sql() already have try/catch and fall back gracefully.
let _sql: ReturnType<typeof neon> | null = null;

function getSql(): ReturnType<typeof neon> {
  if (!_sql) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
    _sql = neon(process.env.DATABASE_URL);
  }
  return _sql;
}

export const sql: ReturnType<typeof neon> = new Proxy(
  // placeholder callable
  ((() => {}) as unknown as ReturnType<typeof neon>),
  {
    apply(_t, _ctx, args) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (getSql() as any)(...args);
    },
  }
);
