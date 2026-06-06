import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const secret = () => new TextEncoder().encode(process.env.JWT_SECRET ?? 'dev-secret-change-me');

export const ADMIN_COOKIE = 'ng_admin';

export async function signAdminToken(): Promise<string> {
  return new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('12h')
    .sign(secret());
}

export async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, secret());
    return payload.role === 'admin';
  } catch {
    return false;
  }
}

export async function getAdminTokenFromCookies(): Promise<string | null> {
  const jar = await cookies();
  return jar.get(ADMIN_COOKIE)?.value ?? null;
}

export async function isAdminAuthed(): Promise<boolean> {
  const token = await getAdminTokenFromCookies();
  if (!token) return false;
  return verifyAdminToken(token);
}
