import { NextRequest, NextResponse } from 'next/server';
import { signup } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { companyName, email, password } = await req.json();
    if (!companyName || !email || !password) {
      return NextResponse.json({ success: false, error: 'All fields are required.' }, { status: 400 });
    }
    const result = await signup(companyName, email, password);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ success: false, error: 'Internal server error.' }, { status: 500 });
  }
}
