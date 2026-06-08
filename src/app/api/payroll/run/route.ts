import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { runPayroll } from '@/lib/payroll';

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || !['HR Admin', 'Super Admin'].includes(session.role)) {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
  }
  const { period, dateFrom, dateTo } = await req.json();
  const result = runPayroll({ period, dateFrom, dateTo });
  return NextResponse.json(result, { status: result.success ? 200 : 400 });
}
