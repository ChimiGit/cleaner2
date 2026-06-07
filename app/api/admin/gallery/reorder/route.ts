import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { galleryImages } from '@/lib/schema';
import { isAdminAuthed } from '@/lib/auth';
import { eq } from 'drizzle-orm';

export async function PUT(req: NextRequest) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { ids }: { ids: number[] } = await req.json();
  await Promise.all(ids.map((id, i) => db.update(galleryImages).set({ sortOrder: i }).where(eq(galleryImages.id, id))));
  return NextResponse.json({ ok: true });
}
