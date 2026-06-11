import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { galleryImages } from '@/lib/schema';
import { asc, count } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

const PAGE_SIZE = 10;

export async function GET(req: NextRequest) {
  try {
    const offset = Number(req.nextUrl.searchParams.get('offset') ?? 0);
    const [images, [{ total }]] = await Promise.all([
      db.select().from(galleryImages).orderBy(asc(galleryImages.sortOrder), asc(galleryImages.createdAt)).limit(PAGE_SIZE).offset(offset),
      db.select({ total: count() }).from(galleryImages),
    ]);
    return NextResponse.json({ images, total });
  } catch {
    return NextResponse.json({ images: [], total: 0 });
  }
}
