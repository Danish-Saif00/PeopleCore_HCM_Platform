import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/data/mock-db';

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== 'Super Admin') {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
  }

  const company = db.getCompany();
  return NextResponse.json({ success: true, data: company });
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== 'Super Admin') {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const updated = db.updateCompany({
      name: body.name,
      subdomain: body.subdomain,
      country: body.country,
    });
    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
