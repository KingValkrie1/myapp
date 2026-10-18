import { db } from '@/db';
import { sql } from 'drizzle-orm';

export async function GET() {
  try {
    await db.execute(sql`select 1`);
    return Response.json({ ok: true, ts: Date.now() });
  } catch (e) {
    return Response.json({ ok: false, error: String(e) }, { status: 503 });
  }
}
