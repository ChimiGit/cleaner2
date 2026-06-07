import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { galleryImages } from '@/lib/schema';
import { isAdminAuthed } from '@/lib/auth';
import { asc } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const images = await db.select().from(galleryImages).orderBy(asc(galleryImages.sortOrder), asc(galleryImages.createdAt));
  return NextResponse.json(images);
}

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { key, url, caption } = await req.json();
  const maxOrder = await db.select({ sortOrder: galleryImages.sortOrder }).from(galleryImages).orderBy(asc(galleryImages.sortOrder));
  const nextOrder = maxOrder.length > 0 ? Math.max(...maxOrder.map(r => r.sortOrder)) + 1 : 0;
  const [image] = await db.insert(galleryImages).values({ key, url, caption: caption ?? '', sortOrder: nextOrder }).returning();
  return NextResponse.json(image);
}
