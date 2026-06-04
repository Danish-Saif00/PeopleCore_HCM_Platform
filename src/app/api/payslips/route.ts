import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getPayslipsForEmployee, getPayslipsByRun } from '@/lib/payroll';
import { db } from '@/data/mock-db';

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const employeeId = searchParams.get('employeeId');
  const runId = searchParams.get('runId');

  // Employees and Managers can only fetch their own payslips
  if (['Employee', 'Manager'].includes(session.role)) {
    const slips = getPayslipsForEmployee(session.employeeId);
    return NextResponse.json({ success: true, data: slips });
  }

  // Admins can query by payroll run or employee
  if (runId) {
    const slips = getPayslipsByRun(runId).map((s) => ({
      ...s,
      employee: db.getEmployeeById(s.employeeId),
    }));
    return NextResponse.json({ success: true, data: slips });
  }

  if (employeeId) {
    const slips = getPayslipsForEmployee(employeeId);
    return NextResponse.json({ success: true, data: slips });
  }

  const slips = db.getPayslips().map((s) => ({
    ...s,
    employee: db.getEmployeeById(s.employeeId),
  }));
  return NextResponse.json({ success: true, data: slips });
}
