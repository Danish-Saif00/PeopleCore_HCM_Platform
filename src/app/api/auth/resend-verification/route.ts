import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/data/mock-db';
import { logMockEmail } from '@/lib/email-events';

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  const pending = db.getPendingSignupByEmail(String(email ?? ''));
  if (!pending) return NextResponse.json({ success: false, error: 'Pending signup not found.' }, { status: 404 });
  pending.verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
  pending.expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();
  db.addPendingSignup(pending);
  logMockEmail(pending.email, 'verification', 'Your new PeopleCore verification code', `Your verification code is ${pending.verificationCode}. It expires in 15 minutes.`);
  return NextResponse.json({ success: true, verificationCode: pending.verificationCode });
}
