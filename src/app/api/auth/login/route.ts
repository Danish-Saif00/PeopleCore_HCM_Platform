import { NextRequest, NextResponse } from 'next/server';
import { login } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email and password are required.' }, { status: 400 });
    }
    const result = await login(email, password);
    if (!result.success) {
      return NextResponse.json(result, { status: 401 });
    }
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Internal server error.' }, { status: 500 });
  }
}
