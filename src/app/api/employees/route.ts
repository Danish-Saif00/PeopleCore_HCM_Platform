import { NextRequest, NextResponse } from 'next/server';
import { db, generateId } from '@/data/mock-db';
import { getSession } from '@/lib/auth';
import type { Employee } from '@/types/peoplecore';
import { getProfileImageUrl } from '@/lib/profile-image';

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  const { searchParams } = new URL(req.url);
  let employees = db.getEmployees();
  const search = searchParams.get('search');
  const department = searchParams.get('department');
  const status = searchParams.get('status');
  const sortBy = searchParams.get('sortBy') ?? 'fullName';
  const sortDir = searchParams.get('sortDir') ?? 'asc';
  if (search) {
    const q = search.toLowerCase();
    employees = employees.filter(
      (e) => e.fullName.toLowerCase().includes(q) || e.email.toLowerCase().includes(q)
    );
  }
  if (department && department !== 'all') {
    employees = employees.filter((e) => e.department === department);
  }
  if (status && status !== 'all') {
    employees = employees.filter((e) => e.status === status);
  }
  employees = employees.sort((a, b) => {
    const aVal = String(a[sortBy as keyof Employee] ?? '');
    const bVal = String(b[sortBy as keyof Employee] ?? '');
    return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
  });
  return NextResponse.json({ success: true, data: employees });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || !['HR Admin', 'Super Admin'].includes(session.role)) {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
  }
  const body = await req.json();
  const employeeId = generateId('emp');
  const emp: Employee = {
    id: employeeId,
    companyId: 'company_001',
    managerId: body.managerId ?? null,
    fullName: body.fullName,
    email: body.email,
    phone: body.phone ?? '',
    department: body.department,
    departmentId: body.departmentId ?? '',
    jobTitle: body.jobTitle,
    startDate: body.startDate,
    status: 'Active',
    employmentType: body.employmentType ?? 'Full-time',
    avatarUrl: getProfileImageUrl(employeeId),
    baseSalary: Number(body.baseSalary) ?? 0,
    role: body.role ?? 'Employee',
  };
  db.addEmployee(emp);
  return NextResponse.json({ success: true, data: emp });
}
