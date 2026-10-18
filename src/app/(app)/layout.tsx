import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import { logoutAction } from '../(auth)/actions';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { user } = await getSession();
  if (!user) redirect('/login');
  return (
    <div className="min-h-screen">
      <nav className="border-b px-6 py-3 flex items-center gap-4">
        <Link href="/dashboard" className="font-medium">Dashboard</Link>
        <Link href="/items">Items</Link>
        {user.role === 'admin' && <Link href="/admin/users">Admin</Link>}
        <span className="ml-auto text-sm text-gray-500">{user.email}</span>
        <form action={logoutAction}><button className="text-sm underline">Keluar</button></form>
      </nav>
      <main className="p-6">{children}</main>
    </div>
  );
}
