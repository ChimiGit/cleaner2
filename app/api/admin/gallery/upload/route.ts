import { NextRequest, NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3, BUCKET } from '@/lib/minio';
import { isAdminAuthed } from '@/lib/auth';
import { db } from '@/lib/db';
import { galleryImages } from '@/lib/schema';
import { randomUUID } from 'crypto';
import heicConvert from 'heic-convert';

const HEIC_EXTS = new Set(['heic', 'heif']);

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });

  const origExt = (file.name.split('.').pop() ?? '').toLowerCase();
  const isHeic = HEIC_EXTS.has(origExt) || file.type === 'image/heic' || file.type === 'image/heif';

  let buffer = Buffer.from(await file.arrayBuffer());
  let ext = origExt;
  let contentType = file.type || 'image/jpeg';

  if (isHeic) {
    const converted = await heicConvert({ buffer, format: 'JPEG', quality: 0.9 });
    buffer = Buffer.from(converted);
    ext = 'jpg';
    contentType = 'image/jpeg';
  }

  const key = `gallery/${randomUUID()}.${ext}`;

  await s3.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  }));

  const url = `/api/gallery/image/${key}`;

  const maxRows = await db.select({ sortOrder: galleryImages.sortOrder }).from(galleryImages);
  const nextOrder = maxRows.length > 0 ? Math.max(...maxRows.map(r => r.sortOrder)) + 1 : 0;
  const [image] = await db.insert(galleryImages).values({ key, url, caption: '', sortOrder: nextOrder }).returning();

  return NextResponse.json(image);
}
