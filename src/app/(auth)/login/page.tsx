import Link from 'next/link';
import { loginAction } from '../actions';

export default function LoginPage() {
  return (
    <main className="mx-auto max-w-sm p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Masuk</h1>
      <form action={loginAction as any} className="space-y-3">
        <input name="email" type="email" required placeholder="email"
          className="w-full border rounded px-3 py-2" />
        <input name="password" type="password" required placeholder="password (8+ karakter)"
          className="w-full border rounded px-3 py-2" />
        <button type="submit" className="w-full bg-black text-white rounded py-2">Masuk</button>
      </form>
      <p className="text-sm text-gray-600">
        Belum punya akun? <Link href="/signup" className="underline">Daftar</Link>
      </p>
    </main>
  );
}
