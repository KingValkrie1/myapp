import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/session';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user } = await getSession();
  if (!user) redirect('/login');
  if (user.role !== 'admin') redirect('/dashboard');
  return (
    <div className="min-h-screen">
      <nav className="border-b px-6 py-3 flex items-center gap-4 bg-gray-50">
        <Link href="/admin/users" className="font-medium">Users</Link>
        <Link href="/dashboard" className="ml-auto text-sm underline">Kembali</Link>
      </nav>
      <main className="p-6">{children}</main>
    </div>
  );
}
