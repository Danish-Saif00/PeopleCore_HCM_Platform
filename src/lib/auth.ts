import { db, generateId } from '@/data/mock-db';
import type { AuthSession, Role } from '@/types/peoplecore';
import { cookies } from 'next/headers';

const SESSION_COOKIE = 'pc_session';
const SESSION_DURATION_MS = 8 * 60 * 60 * 1000; // 8 hours
const MAX_FAILED_ATTEMPTS = 5;

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
  // Reset failed attempts on success
  db.updateAuthUser(authUser.id, { failedLoginAttempts: 0 });
  const now = new Date();
  const session: AuthSession = {
    userId: authUser.id,
    employeeId: authUser.employeeId,
    email: authUser.email,
    role: authUser.role,
    expiresAt: new Date(now.getTime() + SESSION_DURATION_MS).toISOString(),
    lastActivity: now.toISOString(),
  };
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, JSON.stringify(session), {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: SESSION_DURATION_MS / 1000,
    path: '/',
  });
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
    const session: AuthSession = JSON.parse(cookie.value);
    if (new Date(session.expiresAt) < new Date()) {
      cookieStore.delete(SESSION_COOKIE);
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export async function refreshSession(): Promise<void> {
  try {
    const session = await getSession();
    if (!session) return;
    const now = new Date();
    const updated: AuthSession = {
      ...session,
      lastActivity: now.toISOString(),
      expiresAt: new Date(now.getTime() + SESSION_DURATION_MS).toISOString(),
    };
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, JSON.stringify(updated), {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: SESSION_DURATION_MS / 1000,
      path: '/',
    });
  } catch {
    // ignore
  }
}

export async function signup(
  companyName: string,
  email: string,
  password: string
): Promise<SignupResult> {
  const existing = db.getAuthUserByEmail(email);
  if (existing) {
    return { success: false, error: 'An account with this email already exists.' };
  }
  const employeeId = generateId('emp');
  const userId = generateId('auth');
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
  db.addEmployee({
    id: employeeId,
    companyId: 'company_001',
    managerId: null,
    fullName: email
      .split('@')[0]
      .replace(/[._-]/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase()),
    email,
    phone: '',
    department: 'General',
    departmentId: '',
    jobTitle: 'Team Member',
    startDate: new Date().toISOString().split('T')[0],
    status: 'Active',
    employmentType: 'Full-time',
    avatarUrl: '',
    baseSalary: 0,
    role: 'Employee',
  });
  db.addAuthUser({
    id: userId,
    employeeId,
    email,
    password,
    role: 'Employee',
    failedLoginAttempts: 0,
    locked: false,
    verified: false,
  });
  return { success: true, verificationCode };
}

export async function setSessionFromClient(sessionStr: string): Promise<void> {
  const cookieStore = await cookies();
  const session: AuthSession = JSON.parse(sessionStr);
  cookieStore.set(SESSION_COOKIE, JSON.stringify(session), {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: SESSION_DURATION_MS / 1000,
    path: '/',
  });
}
