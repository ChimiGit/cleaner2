import { NextRequest, NextResponse } from 'next/server';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { s3, BUCKET } from '@/lib/minio';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ key: string[] }> }
) {
  const { key: keyParts } = await params;
  const key = keyParts.join('/');

  try {
    const cmd = new GetObjectCommand({ Bucket: BUCKET, Key: key });
    const obj = await s3.send(cmd);

    const body = obj.Body as NodeJS.ReadableStream;
    const headers: Record<string, string> = {
      'Cache-Control': 'public, max-age=31536000, immutable',
    };
    if (obj.ContentType) headers['Content-Type'] = obj.ContentType;
    if (obj.ContentLength) headers['Content-Length'] = String(obj.ContentLength);

    return new NextResponse(body as unknown as BodyInit, { headers });
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}
