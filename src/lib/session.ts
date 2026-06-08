import { SignJWT, jwtVerify } from 'jose';
import type { AuthSession, Role } from '@/types/peoplecore';
import { getAuthSecret } from '@/lib/config.server';

export const SESSION_COOKIE = 'pc_session';
export const SESSION_DURATION_SECONDS = 8 * 60 * 60;

type SessionClaims = {
  userId: string;
  employeeId: string;
  email: string;
  role: Role;
  lastActivity: string;
};

function secretKey() {
  return new TextEncoder().encode(getAuthSecret());
}

export async function signSession(session: AuthSession): Promise<string> {
  return new SignJWT({
    userId: session.userId,
    employeeId: session.employeeId,
    email: session.email,
    role: session.role,
    lastActivity: session.lastActivity,
  } satisfies SessionClaims)
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(session.userId)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(secretKey());
}

export async function verifySession(token: string): Promise<AuthSession | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey());
    const claims = payload as typeof payload & SessionClaims;
    if (!claims.userId || !claims.employeeId || !claims.email || !claims.role || !claims.exp) return null;
    return {
      userId: claims.userId,
      employeeId: claims.employeeId,
      email: claims.email,
      role: claims.role,
      lastActivity: claims.lastActivity ?? new Date((claims.iat ?? 0) * 1000).toISOString(),
      expiresAt: new Date(claims.exp * 1000).toISOString(),
    };
  } catch {
    return null;
  }
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  maxAge: SESSION_DURATION_SECONDS,
  path: '/',
  secure: process.env.NODE_ENV === 'production',
};
