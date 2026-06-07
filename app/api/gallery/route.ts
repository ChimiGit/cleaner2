import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { galleryImages } from '@/lib/schema';
import { asc } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const images = await db.select().from(galleryImages).orderBy(asc(galleryImages.sortOrder), asc(galleryImages.createdAt));
    return NextResponse.json(images);
  } catch {
    return NextResponse.json([]);
  }
}
