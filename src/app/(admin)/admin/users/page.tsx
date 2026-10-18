import { db } from '@/db';
import { users } from '@/db/schema';
import { requireAdmin } from '@/lib/session';
import { desc } from 'drizzle-orm';

export default async function AdminUsersPage() {
  await requireAdmin();
  const rows = await db.select({
    id: users.id, email: users.email, role: users.role, createdAt: users.createdAt,
  }).from(users).orderBy(desc(users.createdAt)).limit(200);
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Users</h1>
      <table className="w-full border">
        <thead className="bg-gray-50 text-left">
          <tr>
            <th className="p-2 border-b">Email</th>
            <th className="p-2 border-b">Role</th>
            <th className="p-2 border-b">Dibuat</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((u) => (
            <tr key={u.id}>
              <td className="p-2 border-b">{u.email}</td>
              <td className="p-2 border-b">{u.role}</td>
              <td className="p-2 border-b text-sm text-gray-600">
                {new Date(u.createdAt).toLocaleString('id-ID')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
