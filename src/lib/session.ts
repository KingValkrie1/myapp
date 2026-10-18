import { cookies } from 'next/headers';
import { cache } from 'react';
import { lucia } from './auth';

export const getSession = cache(async () => {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(lucia.sessionCookieName)?.value ?? null;
  if (!sessionId) return { user: null, session: null };
  const { user, session } = await lucia.validateSession(sessionId);
  if (session?.fresh) {
    const c = lucia.createSessionCookie(session.id);
    cookieStore.set(c.name, c.value, c.attributes);
  }
  if (!session) {
    const c = lucia.createBlankSessionCookie();
    cookieStore.set(c.name, c.value, c.attributes);
  }
  return { user, session };
});

export async function requireUser() {
  const { user } = await getSession();
  if (!user) throw new Error('UNAUTHORIZED');
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== 'admin') throw new Error('FORBIDDEN');
  return user;
}
