import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getNotifications, markAllRead } from '@/lib/notifications';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  const notifs = getNotifications(session.userId);
  return NextResponse.json({ success: true, data: notifs });
}

export async function PUT() {
  const session = await getSession();
  if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  markAllRead(session.userId);
  return NextResponse.json({ success: true });
}
