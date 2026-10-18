import Link from 'next/link';

export default function Home() {
  return (
    <main className="mx-auto max-w-2xl p-8 space-y-6">
      <h1 className="text-3xl font-semibold">myapp</h1>
      <p className="text-gray-600">Fondasi Next.js + Drizzle + Lucia.</p>
      <div className="flex gap-3">
        <Link href="/signup" className="bg-black text-white px-4 py-2 rounded">Daftar</Link>
        <Link href="/login" className="border px-4 py-2 rounded">Masuk</Link>
        <Link href="/dashboard" className="border px-4 py-2 rounded">Dashboard</Link>
      </div>
    </main>
  );
}
