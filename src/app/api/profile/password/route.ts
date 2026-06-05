import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/data/mock-db';
import { getSession } from '@/lib/auth';
import { validatePasswordStrength } from '@/lib/password';

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body: unknown = await req.json();
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ success: false, error: 'Invalid password update.' }, { status: 400 });
    }

    const input = body as Record<string, unknown>;
    if (typeof input.currentPassword !== 'string' || typeof input.newPassword !== 'string') {
      return NextResponse.json({ success: false, error: 'Current and new passwords are required.' }, { status: 400 });
    }

    const authUser = db.getAuthUserById(session.userId) ?? db.getAuthUserByEmployeeId(session.employeeId);
    if (!authUser || authUser.password !== input.currentPassword) {
      return NextResponse.json({ success: false, error: 'Current password is incorrect.' }, { status: 400 });
    }

    if (input.currentPassword === input.newPassword) {
      return NextResponse.json({ success: false, error: 'New password must be different from the current password.' }, { status: 400 });
    }

    const validation = validatePasswordStrength(input.newPassword);
    if (!validation.valid) {
      return NextResponse.json({ success: false, error: validation.error }, { status: 400 });
    }

    db.updateAuthUser(authUser.id, { password: input.newPassword });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: 'Unable to update password.' }, { status: 400 });
  }
}
