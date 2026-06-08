import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/data/mock-db';

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  const query = new URL(req.url).searchParams.get('q')?.trim().toLowerCase() ?? '';
  const data = query.length < 2 ? [] : db.getEmployees()
    .filter((employee) => employee.fullName.toLowerCase().includes(query))
    .slice(0, 6)
    .map(({ id, fullName, jobTitle, department, avatarUrl }) => ({ id, fullName, jobTitle, department, avatarUrl }));
  return NextResponse.json({ success: true, data });
}
