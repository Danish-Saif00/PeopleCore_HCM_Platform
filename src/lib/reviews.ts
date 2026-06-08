import { db, generateId } from '@/data/mock-db';
import type { ReviewCycle, Review, ReviewCycleStatus } from '@/types/peoplecore';
import { createNotification } from './notifications';
import { logMockEmail } from './email-events';

export function getReviewCycles(): ReviewCycle[] {
  return db.getReviewCycles();
}

export function getReviewCycleById(id: string): ReviewCycle | undefined {
  return db.getReviewCycleById(id);
}

export function getReviewsForEmployee(employeeId: string): Review[] {
  return db.getReviewsByEmployee(employeeId);
}

export function getReviewsForReviewer(reviewerId: string): Review[] {
  return db.getReviewsByReviewer(reviewerId);
}

export function getReviewsByCycle(cycleId: string): Review[] {
  return db.getReviewsByCycle(cycleId);
}

export interface CreateCycleInput {
  name: string;
  period: string;
  employeeIds: string[];
  createdBy: string;
  companyId?: string;
}

export function createCycle(input: CreateCycleInput): ReviewCycle {
  const cycleId = generateId('review_cycle');
  const cycle: ReviewCycle = {
    id: cycleId,
    companyId: input.companyId ?? 'company_001',
    name: input.name,
    period: input.period,
    employeeIds: input.employeeIds,
    createdBy: input.createdBy,
    status: 'In Progress',
  };
  db.addReviewCycle(cycle);
  input.employeeIds.forEach((empId) => {
    const employee = db.getEmployeeById(empId);
    if (!employee) return;
    const reviewerId = employee.managerId ?? input.createdBy;
    const review: Review = {
      id: generateId('review'),
      cycleId,
      employeeId: empId,
      reviewerId,
      period: input.name,
      ratings: { overall: null },
      strengths: '',
      areasOfImprovement: '',
      goals: '',
      comment: '',
      status: 'Pending',
      submittedAt: null,
    };
    db.addReview(review);
    const reviewerAuth = db.getAuthUserByEmployeeId(reviewerId);
    if (reviewerAuth) {
      createNotification({
        userId: reviewerAuth.id,
        employeeId: reviewerId,
        title: 'Review assigned',
        message: `Please complete the ${input.name} review for ${employee.fullName}.`,
        type: 'Reviews',
      });
      const reviewer = db.getEmployeeById(reviewerId);
      if (reviewer) logMockEmail(reviewer.email, 'review_assigned', 'Performance review assigned', `Complete the ${input.name} review for ${employee.fullName}.`);
    }
  });
  return cycle;
}

export interface SubmitReviewInput {
  ratings: { overall: number };
  strengths: string;
  areasOfImprovement: string;
  goals: string;
  comment: string;
}

export function submitReview(
  reviewId: string,
  input: SubmitReviewInput
): Review | null {
  const review = db.getReviewById(reviewId);
  if (!review) return null;
  const updated = db.updateReview(reviewId, {
    ...input,
    status: 'Completed',
    submittedAt: new Date().toISOString(),
  });
  if (updated) {
    const empAuth = db.getAuthUserByEmployeeId(review.employeeId);
    const reviewer = db.getEmployeeById(review.reviewerId);
    if (empAuth && reviewer) {
      createNotification({
        userId: empAuth.id,
        employeeId: review.employeeId,
        title: 'Performance review completed',
        message: `${reviewer.fullName} has completed your ${review.period} performance review.`,
        type: 'Reviews',
      });
      const employee = db.getEmployeeById(review.employeeId);
      if (employee) logMockEmail(employee.email, 'review_submitted', 'Performance review completed', `${reviewer.fullName} completed your ${review.period} review.`);
    }
  }
  return updated;
}
