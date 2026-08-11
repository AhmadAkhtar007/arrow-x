import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'arrowx-super-secure-production-jwt-token-key-2026-xyz-livinglegend'
);

export const AUTH_COOKIE_NAME = 'arrowx_auth_token';

export interface TokenPayload {
  id: string;
  username: string;
  email?: string;
  role: 'customer' | 'admin' | 'superadmin';
  name?: string;
}

// 1. Password Hashing
export async function hashPassword(plainText: string): Promise<string> {
  return await bcrypt.hash(plainText, 10);
}

export async function verifyPassword(plainText: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(plainText, hash);
}

// 2. JWT Signing
export async function signToken(payload: TokenPayload, expiresIn: string = '365d'): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(JWT_SECRET);
}

// 3. JWT Verification
export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as TokenPayload;
  } catch {
    return null;
  }
}

// 4. Server-Side Session Helper
export async function getCurrentSession(): Promise<TokenPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;
  return await verifyToken(token);
}
