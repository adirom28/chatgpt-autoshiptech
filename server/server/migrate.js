// server/migrate.js
import fs from 'fs';
import path from 'path';
import { db } from './pg.js';

export async function runMigrationsAndSeed() {
  const schemaPath = path.join(process.cwd(), 'sql', 'schema.sql');
  const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
  await db.none(schemaSQL);

  if (process.env.SEED_DEMO === 'true') {
    // bcrypt hash for "ChangeThisPassword!"
    const hash = '$2b$10$5eOYH5H0Mdy2Gq2YP4sZxukfF2r9ZjJwIrV3J2orX9AwtZkh9vHpu';
    const user = await db.oneOrNone(
      'INSERT INTO users (email, password_hash, company_name) VALUES ($1,$2,$3) ON CONFLICT (email) DO UPDATE SET company_name=EXCLUDED.company_name RETURNING id',
      ['demo@autoshiptech.com', hash, 'Demo Co']
    );
    const userId = user?.id || (await db.one('SELECT id FROM users WHERE email=$1', ['demo@autoshiptech.com'])).id;
    const appDomain = process.env.APP_DOMAIN || 'autoshiptech.com';
    await db.none(
      `INSERT INTO partner_sites (user_id, domain, publishable_key, theme)
       VALUES ($1,$2,$3,$4)
       ON CONFLICT (publishable_key) DO NOTHING`,
      [userId, appDomain, 'AST-PUB-TEST-123', { primary: '#6D28D9' }]
    );
  }
}

// allow "node server/migrate.js" to run
runMigrationsAndSeed().then(() => {
  console.log('[AST] Migration + seed complete');
  process.exit(0);
}).catch(err => {
  console.error('[AST] Migration failed', err);
  process.exit(1);
});
