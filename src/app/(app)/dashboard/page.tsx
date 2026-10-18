import { requireUser } from '@/lib/session';
import { db } from '@/db';
import { items } from '@/db/schema';
import { eq, count } from 'drizzle-orm';

export default async function DashboardPage() {
  const user = await requireUser();
  const [{ value }] = await db.select({ value: count() }).from(items).where(eq(items.ownerId, user.id));
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="text-gray-600">Halo, {user.email}.</p>
      <div className="grid grid-cols-2 gap-4 max-w-md">
        <div className="border rounded p-4">
          <p className="text-sm text-gray-500">Item kamu</p>
          <p className="text-3xl font-semibold">{value}</p>
        </div>
        <div className="border rounded p-4">
          <p className="text-sm text-gray-500">Role</p>
          <p className="text-3xl font-semibold">{user.role}</p>
        </div>
      </div>
    </div>
  );
}
