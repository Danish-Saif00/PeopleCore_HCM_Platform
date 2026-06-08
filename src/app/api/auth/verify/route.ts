import { NextRequest, NextResponse } from 'next/server';
import { db, generateId } from '@/data/mock-db';
import { getProfileImageUrl } from '@/lib/profile-image';

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'company';
}

export async function POST(req: NextRequest) {
  const { email, code } = await req.json();
  const pending = db.getPendingSignupByEmail(String(email ?? ''));
  if (!pending || pending.verificationCode !== code) {
    return NextResponse.json({ success: false, error: 'Invalid verification code.' }, { status: 400 });
  }
  if (new Date(pending.expiresAt) <= new Date()) {
    return NextResponse.json({ success: false, error: 'Verification code expired. Request a new code.' }, { status: 400 });
  }

  const companyId = generateId('company');
  const employeeId = generateId('emp');
  const userId = generateId('auth');
  const baseSlug = slugify(pending.companyName);
  const suffix = db.getCompanies().filter((company) => company.subdomain.startsWith(baseSlug)).length;
  db.addCompany({
    id: companyId,
    name: pending.companyName,
    subdomain: `${baseSlug}${suffix ? `-${suffix + 1}` : ''}.peoplecore.com`,
    country: 'United States',
    createdAt: new Date().toISOString(),
  });
  db.addEmployee({
    id: employeeId,
    companyId,
    managerId: null,
    fullName: pending.adminFullName,
    email: pending.email,
    phone: '',
    department: 'Executive',
    departmentId: '',
    jobTitle: 'Company Administrator',
    startDate: new Date().toISOString().slice(0, 10),
    status: 'Active',
    employmentType: 'Full-time',
    avatarUrl: getProfileImageUrl(employeeId),
    baseSalary: 0,
    role: 'Super Admin',
  });
  db.addAuthUser({
    id: userId,
    employeeId,
    email: pending.email,
    password: pending.password,
    role: 'Super Admin',
    failedLoginAttempts: 0,
    locked: false,
    verified: true,
  });
  db.deletePendingSignup(pending.id);
  return NextResponse.json({ success: true });
}
