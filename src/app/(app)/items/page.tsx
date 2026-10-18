import { db } from '@/db';
import { items } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { requireUser } from '@/lib/session';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';

async function createItem(formData: FormData) {
  'use server';
  const user = await requireUser();
  const title = String(formData.get('title') ?? '').trim();
  if (!title) return;
  await db.insert(items).values({ ownerId: user.id, title });
  revalidatePath('/items');
}

export default async function ItemsPage() {
  const user = await requireUser();
  const rows = await db.select().from(items)
    .where(eq(items.ownerId, user.id))
    .orderBy(desc(items.createdAt))
    .limit(50);
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Items</h1>
      <form action={createItem} className="flex gap-2">
        <input name="title" required placeholder="judul item"
          className="flex-1 border rounded px-3 py-2" />
        <button className="bg-black text-white rounded px-4">Tambah</button>
      </form>
      <ul className="divide-y border rounded">
        {rows.length === 0 && <li className="p-4 text-gray-500">Belum ada item.</li>}
        {rows.map((it) => (
          <li key={it.id} className="p-4">
            <Link href={`/items/${it.id}`} className="font-medium">{it.title}</Link>
            <p className="text-sm text-gray-500">{new Date(it.createdAt).toLocaleString('id-ID')}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
