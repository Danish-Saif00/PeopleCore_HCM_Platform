import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/data/mock-db';
import { createSessionForUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const { token, password } = await req.json();
  const invite = db.getInviteByToken(String(token ?? ''));
  if (!invite || invite.acceptedAt || new Date(invite.expiresAt) <= new Date()) {
    return NextResponse.json({ success: false, error: 'This invitation is invalid or expired.' }, { status: 400 });
  }
  if (typeof password !== 'string' || password.length < 8) {
    return NextResponse.json({ success: false, error: 'Password must be at least 8 characters.' }, { status: 400 });
  }
  const authUser = db.getAuthUserByEmployeeId(invite.employeeId);
  if (!authUser) return NextResponse.json({ success: false, error: 'Invited account not found.' }, { status: 404 });
  db.updateAuthUser(authUser.id, { password, verified: true, failedLoginAttempts: 0, locked: false });
  db.updateInvite(invite.id, { acceptedAt: new Date().toISOString() });
  const session = await createSessionForUser(authUser.id);
  return NextResponse.json({ success: true, session });
}
