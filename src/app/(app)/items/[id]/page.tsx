import { db } from '@/db';
import { items } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { requireUser } from '@/lib/session';
import { notFound, redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export default async function ItemDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser();
  const [row] = await db.select().from(items)
    .where(and(eq(items.id, id), eq(items.ownerId, user.id))).limit(1);
  if (!row) notFound();

  async function updateItem(formData: FormData) {
    'use server';
    const u = await requireUser();
    const title = String(formData.get('title') ?? '').trim();
    const body = String(formData.get('body') ?? '');
    if (!title) return;
    await db.update(items).set({ title, body, updatedAt: new Date() })
      .where(and(eq(items.id, id), eq(items.ownerId, u.id)));
    revalidatePath(`/items/${id}`);
  }

  async function deleteItem() {
    'use server';
    const u = await requireUser();
    await db.delete(items).where(and(eq(items.id, id), eq(items.ownerId, u.id)));
    revalidatePath('/items');
    redirect('/items');
  }

  return (
    <div className="space-y-6 max-w-xl">
      <h1 className="text-2xl font-semibold">{row.title}</h1>
      <form action={updateItem} className="space-y-3">
        <input name="title" defaultValue={row.title} className="w-full border rounded px-3 py-2" />
        <textarea name="body" defaultValue={row.body} rows={6}
          className="w-full border rounded px-3 py-2" />
        <div className="flex gap-2">
          <button className="bg-black text-white rounded px-4 py-2">Simpan</button>
          <button formAction={deleteItem}
            className="border border-red-500 text-red-600 rounded px-4 py-2">Hapus</button>
        </div>
      </form>
    </div>
  );
}
