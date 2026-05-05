import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import prisma from './db';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-secret-change-me'
);

export interface JWTPayload {
  userId: string;
  email: string;
  role: 'USER' | 'ADMIN';
  membershipTier?: string;
  iat?: number;
  exp?: number;
}

/**
 * Create a signed JWT token for user session
 */
export async function createToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): Promise<string> {
  const token = await new SignJWT(payload as unknown as JWTPayload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(process.env.JWT_EXPIRES_IN || '7d')
    .sign(JWT_SECRET);

  return token;
}

/**
 * Verify and decode a JWT token
 */
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

/**
 * Get the current authenticated user from request cookies
 */
export async function getCurrentUser(request?: NextRequest): Promise<JWTPayload | null> {
  try {
    let token: string | undefined;

    if (request) {
      token = request.cookies.get('medai-token')?.value;
    } else {
      const cookieStore = await cookies();
      token = cookieStore.get('medai-token')?.value;
    }

    if (!token) return null;

    const payload = await verifyToken(token);
    if (!payload) return null;

    // Verify user still exists in database
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, role: true, isBanned: true },
    });

    if (!user || user.isBanned) return null;

    return payload;
  } catch {
    return null;
  }
}

/**
 * Check if current user has admin privileges
 */
export async function requireAdmin(request?: NextRequest): Promise<JWTPayload> {
  const user = await getCurrentUser(request);

  if (!user) {
    throw new Error('Unauthorized: No valid session found');
  }

  if (user.role !== 'ADMIN') {
    throw new Error('Forbidden: Admin access required');
  }

  return user;
}

/**
 * Hash a password using bcrypt-compatible approach
 */
export async function hashPassword(password: string): Promise<string> {
  const bcrypt = await import('bcryptjs');
  return bcrypt.hash(password, 12);
}

/**
 * Verify a password against its hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const bcrypt = await import('bcryptjs');
  return bcrypt.compare(password, hash);
}
