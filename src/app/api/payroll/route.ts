import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getPayrollRuns, getEstimatedGross, getActiveEmployeeCount } from '@/lib/payroll';

export async function GET() {
  const session = await getSession();
  if (!session || !['HR Admin', 'Super Admin'].includes(session.role)) {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
  }
  const runs = getPayrollRuns();
  return NextResponse.json({ success: true, data: runs, meta: { estimatedGross: getEstimatedGross(), employeeCount: getActiveEmployeeCount() } });
}
