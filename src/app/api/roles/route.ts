import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/data/mock-db';
import type { Role } from '@/types/peoplecore';

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== 'Super Admin') {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
  }

  const employees = db.getEmployees();
  const authUsers = db.getAuthUsers();

  const data = employees.map((e) => {
    const auth = authUsers.find((au) => au.employeeId === e.id);
    return {
      employeeId: e.id,
      fullName: e.fullName,
      email: e.email,
      avatarUrl: e.avatarUrl,
      role: auth?.role ?? e.role,
    };
  });

  return NextResponse.json({ success: true, data });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== 'Super Admin') {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { employeeId, role } = await req.json();
    if (!employeeId || !role) {
      return NextResponse.json({ success: false, error: 'Missing employeeId or role' }, { status: 400 });
    }

    // Update employee and auth user role in in-memory DB
    const auth = db.getAuthUserByEmployeeId(employeeId);
    if (auth) {
      db.updateAuthUser(auth.id, { role: role as Role });
    }
    db.updateEmployee(employeeId, { role: role as Role });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
