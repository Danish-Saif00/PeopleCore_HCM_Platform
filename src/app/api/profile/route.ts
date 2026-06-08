import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/data/mock-db';
import { getSession } from '@/lib/auth';
import type { Employee } from '@/types/peoplecore';

const MAX_AVATAR_BYTES = 2 * 1024 * 1024;
const DATA_URL_PATTERN = /^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/]+={0,2})$/;

function validateAvatarDataUrl(value: string): boolean {
  const match = value.match(DATA_URL_PATTERN);
  if (!match) return false;

  const padding = match[2].endsWith('==') ? 2 : match[2].endsWith('=') ? 1 : 0;
  const sourceBytes = Math.floor((match[2].length * 3) / 4) - padding;
  return sourceBytes <= MAX_AVATAR_BYTES;
}

function getProfileData(employee: Employee) {
  const manager = employee.managerId ? db.getEmployeeById(employee.managerId) : null;

  return {
    employee,
    manager: manager
      ? {
          id: manager.id,
          fullName: manager.fullName,
          jobTitle: manager.jobTitle,
        }
      : null,
    completedReviews: db.getReviewsByEmployee(employee.id)
      .filter((review) => review.status === 'Completed')
      .map((review) => ({ ...review, reviewer: db.getEmployeeById(review.reviewerId) })),
  };
}

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const employee = db.getEmployeeById(session.employeeId);
  if (!employee) {
    return NextResponse.json({ success: false, error: 'Profile not found.' }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: getProfileData(employee) });
}

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body: unknown = await req.json();
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ success: false, error: 'Invalid profile update.' }, { status: 400 });
    }

    const input = body as Record<string, unknown>;
    const updates: Pick<Partial<Employee>, 'fullName' | 'phone' | 'avatarUrl'> = {};

    if ('fullName' in input) {
      if (typeof input.fullName !== 'string' || !input.fullName.trim() || input.fullName.trim().length > 100) {
        return NextResponse.json(
          { success: false, error: 'Full name is required and must be 100 characters or fewer.' },
          { status: 400 }
        );
      }
      updates.fullName = input.fullName.trim();
    }

    if ('phone' in input) {
      if (typeof input.phone !== 'string' || input.phone.trim().length > 30) {
        return NextResponse.json(
          { success: false, error: 'Phone number must be 30 characters or fewer.' },
          { status: 400 }
        );
      }
      updates.phone = input.phone.trim();
    }

    if ('avatarUrl' in input) {
      if (typeof input.avatarUrl !== 'string' || !validateAvatarDataUrl(input.avatarUrl)) {
        return NextResponse.json(
          { success: false, error: 'Avatar must be a JPEG, PNG, or WebP image no larger than 2 MB.' },
          { status: 400 }
        );
      }
      updates.avatarUrl = input.avatarUrl;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ success: false, error: 'No supported profile fields were provided.' }, { status: 400 });
    }

    const employee = db.updateEmployee(session.employeeId, updates);
    if (!employee) {
      return NextResponse.json({ success: false, error: 'Profile not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: getProfileData(employee) });
  } catch {
    return NextResponse.json({ success: false, error: 'Unable to update profile.' }, { status: 400 });
  }
}
