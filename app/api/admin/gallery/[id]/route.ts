import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { galleryImages } from '@/lib/schema';
import { isAdminAuthed } from '@/lib/auth';
import { eq } from 'drizzle-orm';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { s3, BUCKET } from '@/lib/minio';

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const [image] = await db.select().from(galleryImages).where(eq(galleryImages.id, Number(id)));
  if (!image) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: image.key }));
  await db.delete(galleryImages).where(eq(galleryImages.id, Number(id)));

  return NextResponse.json({ ok: true });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const { caption } = await req.json();
  const [image] = await db.update(galleryImages).set({ caption }).where(eq(galleryImages.id, Number(id))).returning();
  return NextResponse.json(image);
}
