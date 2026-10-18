import Link from 'next/link';
import { signupAction } from '../actions';

export default function SignupPage() {
  return (
    <main className="mx-auto max-w-sm p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Daftar</h1>
      <form action={signupAction as any} className="space-y-3">
        <input name="email" type="email" required placeholder="email"
          className="w-full border rounded px-3 py-2" />
        <input name="password" type="password" required placeholder="password (8+ karakter)"
          className="w-full border rounded px-3 py-2" />
        <button type="submit" className="w-full bg-black text-white rounded py-2">Buat akun</button>
      </form>
      <p className="text-sm text-gray-600">
        Sudah punya akun? <Link href="/login" className="underline">Masuk</Link>
      </p>
    </main>
  );
}
