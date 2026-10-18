import { Lucia } from 'lucia';
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import { db } from '@/db';
import { sessions, users } from '@/db/schema';

const adapter = new DrizzlePostgreSQLAdapter(db, sessions, users);

export const lucia = new Lucia(adapter, {
  sessionCookie: { attributes: { secure: process.env.NODE_ENV === 'production' } },
  getUserAttributes: (attrs) => ({
    email: attrs.email,
    role: attrs.role,
    emailVerifiedAt: attrs.emailVerifiedAt,
  }),
});

declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: { email: string; role: string; emailVerifiedAt: Date | null };
  }
}
