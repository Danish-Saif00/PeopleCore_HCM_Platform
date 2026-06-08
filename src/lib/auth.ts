import { db, generateId } from '@/data/mock-db';
import type { AuthSession, Role } from '@/types/peoplecore';
import { cookies } from 'next/headers';
import { SESSION_COOKIE, SESSION_DURATION_SECONDS, sessionCookieOptions, signSession, verifySession } from '@/lib/session';

const SESSION_DURATION_MS = SESSION_DURATION_SECONDS * 1000;
const MAX_FAILED_ATTEMPTS = 5;

function enrichSession(session: AuthSession): AuthSession {
  const employee = db.getEmployeeById(session.employeeId);

  return {
    ...session,
    fullName: employee?.fullName,
    avatarUrl: employee?.avatarUrl,
  };
}

export interface LoginResult {
  success: boolean;
  session?: AuthSession;
  error?: string;
  locked?: boolean;
  remainingAttempts?: number;
}

export interface SignupResult {
  success: boolean;
  verificationCode?: string;
  error?: string;
}

async function writeSession(session: AuthSession): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, await signSession(session), sessionCookieOptions);
}

export async function login(email: string, password: string): Promise<LoginResult> {
  const authUser = db.getAuthUserByEmail(email);
  if (!authUser) {
    return { success: false, error: 'Invalid email or password.' };
  }
  if (authUser.locked) {
    return { success: false, error: 'Account is locked. Contact your HR admin.', locked: true };
  }
  if (authUser.password !== password) {
    const newAttempts = authUser.failedLoginAttempts + 1;
    const locked = newAttempts >= MAX_FAILED_ATTEMPTS;
    db.updateAuthUser(authUser.id, {
      failedLoginAttempts: newAttempts,
      locked,
    });
    if (locked) {
      return { success: false, error: 'Account locked after 5 failed attempts. Contact your HR admin.', locked: true };
    }
    return {
      success: false,
      error: 'Invalid email or password.',
      remainingAttempts: MAX_FAILED_ATTEMPTS - newAttempts,
    };
  }
  if (!authUser.verified) {
    return { success: false, error: 'Verify your work email before signing in.' };
  }
  // Reset failed attempts on success
  db.updateAuthUser(authUser.id, { failedLoginAttempts: 0 });
  const now = new Date();
  const session = enrichSession({
    userId: authUser.id,
    employeeId: authUser.employeeId,
    email: authUser.email,
    role: authUser.role,
    expiresAt: new Date(now.getTime() + SESSION_DURATION_MS).toISOString(),
    lastActivity: now.toISOString(),
  });
  await writeSession(session);
  return { success: true, session };
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSession(): Promise<AuthSession | null> {
  try {
    const cookieStore = await cookies();
    const cookie = cookieStore.get(SESSION_COOKIE);
    if (!cookie) return null;
    const session = await verifySession(cookie.value);
    if (!session) return null;
    return enrichSession(session);
  } catch {
    return null;
  }
}

export async function refreshSession(): Promise<AuthSession | null> {
  try {
    const session = await getSession();
    if (!session) return null;
    const now = new Date();
    const updated = enrichSession({
      ...session,
      lastActivity: now.toISOString(),
      expiresAt: new Date(now.getTime() + SESSION_DURATION_MS).toISOString(),
    });
    await writeSession(updated);
    return updated;
  } catch {
    return null;
  }
}

export async function signup(
  companyName: string,
  adminFullName: string,
  email: string,
  password: string
): Promise<SignupResult> {
  const existing = db.getAuthUserByEmail(email);
  if (existing) {
    return { success: false, error: 'An account with this email already exists.' };
  }
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
  db.addPendingSignup({
    id: generateId('signup'),
    companyName,
    adminFullName,
    email: email.toLowerCase(),
    password,
    verificationCode,
    expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
  });
  const { logMockEmail } = await import('@/lib/email-events');
  logMockEmail(
    email,
    'verification',
    'Verify your PeopleCore work email',
    `Your verification code is ${verificationCode}. It expires in 15 minutes.`
  );
  return { success: true, verificationCode };
}

export async function createSessionForUser(userId: string): Promise<AuthSession | null> {
  const authUser = db.getAuthUserById(userId);
  if (!authUser) return null;
  const now = new Date();
  const session = enrichSession({
    userId: authUser.id,
    employeeId: authUser.employeeId,
    email: authUser.email,
    role: authUser.role,
    expiresAt: new Date(now.getTime() + SESSION_DURATION_MS).toISOString(),
    lastActivity: now.toISOString(),
  });
  await writeSession(session);
  return session;
}
