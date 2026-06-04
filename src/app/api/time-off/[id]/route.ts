import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { approveRequest, rejectRequest } from '@/lib/time-off';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || !['Manager', 'HR Admin', 'Super Admin'].includes(session.role)) {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
  }
  const { id } = await params;
  const { action, managerNote } = await req.json();
  let result;
  if (action === 'approve') {
    result = approveRequest(id, managerNote);
  } else if (action === 'reject') {
    result = rejectRequest(id, managerNote);
  } else {
    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  }
  if (!result) return NextResponse.json({ success: false, error: 'Request not found' }, { status: 404 });
  return NextResponse.json({ success: true, data: result });
}
