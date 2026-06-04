import { NextResponse } from 'next/server';
import { getSession, refreshSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false, session: null });
  }
  return NextResponse.json({ success: true, session });
}

export async function PUT() {
  await refreshSession();
  return NextResponse.json({ success: true });
}
