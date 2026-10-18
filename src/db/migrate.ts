import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import fs from 'node:fs';

if (fs.existsSync('.env')) {
  const envFile = fs.readFileSync('.env', 'utf-8');
  for (const line of envFile.split('\n')) {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) process.env[match[1].trim()] = match[2].trim();
  }
}

const url = process.env.DATABASE_URL;
if (!url) throw new Error('DATABASE_URL tidak diset');

const sql = postgres(url, { max: 1 });
const db = drizzle(sql);
await migrate(db, { migrationsFolder: './drizzle' });
await sql.end();
console.log('migrations applied');
