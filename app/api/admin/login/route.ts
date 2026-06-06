import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { signAdminToken, ADMIN_COOKIE } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  const storedHash = process.env.ADMIN_PASSWORD_HASH;
  const plainFallback = process.env.ADMIN_PASSWORD;

  let valid = false;
  if (storedHash) {
    valid = await bcrypt.compare(password, storedHash);
  } else if (plainFallback) {
    valid = password === plainFallback;
  }

  if (!valid) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }

  const token = await signAdminToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 12,
  });
  return res;
}
