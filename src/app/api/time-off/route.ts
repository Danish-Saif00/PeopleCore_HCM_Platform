import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { createRequest, getRequestsForEmployee, getRequestsForManager, getAllRequests } from '@/lib/time-off';

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const view = searchParams.get('view') ?? 'mine';
  let requests;
  if (view === 'mine') {
    requests = getRequestsForEmployee(session.employeeId);
  } else if (view === 'manager') {
    requests = getRequestsForManager(session.employeeId);
  } else {
    requests = getAllRequests();
  }
  const type = searchParams.get('type');
  const status = searchParams.get('status');
  if (type && type !== 'all') requests = requests.filter((r) => r.type === type);
  if (status && status !== 'all') requests = requests.filter((r) => r.status === status);
  return NextResponse.json({ success: true, data: requests });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const emp = (await import('@/data/mock-db')).db.getEmployeeById(session.employeeId);
  const managerId = emp?.managerId ?? session.employeeId;
  const request = createRequest({
    employeeId: session.employeeId,
    type: body.type,
    startDate: body.startDate,
    endDate: body.endDate,
    note: body.note ?? '',
    managerId,
  });
  return NextResponse.json({ success: true, data: request });
}
