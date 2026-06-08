import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getReviewCycles, getReviewsForEmployee, getReviewsForReviewer, createCycle, submitReview, getReviewsByCycle } from '@/lib/reviews';
import { db } from '@/data/mock-db';

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const view = searchParams.get('view') ?? 'mine';
  if (view === 'cycles') {
    if (!['HR Admin', 'Super Admin'].includes(session.role)) return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    const cycles = getReviewCycles().map((c) => ({
      ...c,
      reviews: getReviewsByCycle(c.id),
    }));
    return NextResponse.json({ success: true, data: cycles });
  }
  if (view === 'all') {
    if (!['HR Admin', 'Super Admin'].includes(session.role)) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }
    const reviews = db.getReviews().map((r) => ({
      ...r,
      employee: db.getEmployeeById(r.employeeId),
      reviewer: db.getEmployeeById(r.reviewerId),
    }));
    return NextResponse.json({ success: true, data: reviews });
  }
  if (view === 'reviewer') {
    const reviews = getReviewsForReviewer(session.employeeId).map((r) => ({
      ...r,
      employee: db.getEmployeeById(r.employeeId),
      reviewer: db.getEmployeeById(r.reviewerId),
    }));
    return NextResponse.json({ success: true, data: reviews });
  }
  const reviews = getReviewsForEmployee(session.employeeId).map((r) => ({
    ...r,
    employee: db.getEmployeeById(r.employeeId),
    reviewer: db.getEmployeeById(r.reviewerId),
  }));
  return NextResponse.json({ success: true, data: reviews });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  if (body.action === 'create-cycle') {
    if (!['HR Admin', 'Super Admin'].includes(session.role)) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }
    const cycle = createCycle({
      name: body.name,
      period: body.period,
      employeeIds: body.employeeIds,
      createdBy: session.employeeId,
    });
    return NextResponse.json({ success: true, data: cycle });
  }
  if (body.action === 'submit-review') {
    const review = db.getReviewById(body.reviewId);
    if (!review || review.reviewerId !== session.employeeId || review.status === 'Completed') {
      return NextResponse.json({ success: false, error: 'You cannot submit this review.' }, { status: 403 });
    }
    if (!Number.isInteger(body.ratings?.overall) || body.ratings.overall < 1 || body.ratings.overall > 5
      || !body.strengths?.trim() || !body.areasOfImprovement?.trim() || !body.goals?.trim()) {
      return NextResponse.json({ success: false, error: 'Rating, strengths, improvement areas, and goals are required.' }, { status: 400 });
    }
    const result = submitReview(body.reviewId, {
      ratings: body.ratings,
      strengths: body.strengths,
      areasOfImprovement: body.areasOfImprovement,
      goals: body.goals,
      comment: body.comment,
    });
    return NextResponse.json({ success: !!result, data: result });
  }
  return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
}
