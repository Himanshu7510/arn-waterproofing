// Edge-safe JWT session helpers (used by middleware and server code)
import { SignJWT, jwtVerify } from 'jose';

export const SESSION_COOKIE = 'arn_admin_session';

function secretKey() {
  const s = process.env.AUTH_SECRET || process.env.DATABASE_URL || 'dev-insecure-secret-change-me';
  return new TextEncoder().encode(s);
}

export async function createToken(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secretKey());
}

export async function verifyToken(token) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey());
    return payload;
  } catch {
    return null;
  }
}
