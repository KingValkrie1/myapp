'use server';

import { z } from 'zod';
import { Scrypt } from 'oslo/password';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { db } from '@/db';
import { users } from '@/db/schema';
import { lucia } from '@/lib/auth';

const AuthSchema = z.object({ email: z.string().email(), password: z.string().min(8).max(128) });

export async function signupAction(formData: FormData) {
  const parsed = AuthSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });
  if (!parsed.success) return { error: 'Email atau password tidak valid (min 8 karakter)' };

  const existing = await db.select().from(users).where(eq(users.email, parsed.data.email)).limit(1);
  if (existing.length) return { error: 'Email sudah terdaftar' };

  const scrypt = new Scrypt();
  const passwordHash = await scrypt.hash(parsed.data.password);
  
  const [created] = await db.insert(users).values({
    email: parsed.data.email, passwordHash,
  }).returning();

  const session = await lucia.createSession(created.id, {});
  const c = lucia.createSessionCookie(session.id);
  (await cookies()).set(c.name, c.value, c.attributes);
  redirect('/dashboard');
}

export async function loginAction(formData: FormData) {
  const parsed = AuthSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });
  if (!parsed.success) return { error: 'Input tidak valid' };

  const [user] = await db.select().from(users).where(eq(users.email, parsed.data.email)).limit(1);
  if (!user) return { error: 'Email atau password salah' };

  const scrypt = new Scrypt();
  const ok = await scrypt.verify(user.passwordHash, parsed.data.password);
  if (!ok) return { error: 'Email atau password salah' };

  const session = await lucia.createSession(user.id, {});
  const c = lucia.createSessionCookie(session.id);
  (await cookies()).set(c.name, c.value, c.attributes);
  redirect('/dashboard');
}

export async function logoutAction() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(lucia.sessionCookieName)?.value ?? null;
  if (sessionId) {
    await lucia.invalidateSession(sessionId);
    const c = lucia.createBlankSessionCookie();
    cookieStore.set(c.name, c.value, c.attributes);
  }
  redirect('/login');
}
