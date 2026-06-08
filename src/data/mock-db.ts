// ============================================================
// PeopleCore HCM — In-Memory Mock Database
// ============================================================
// Mutable in-memory store initialized from seed data.
// All lib services read/write here. Reset on server restart.
// ============================================================

import { seed } from "./seed";
import type {
  Company,
  Department,
  Employee,
  AuthUser,
  PayrollRun,
  Payslip,
  TimeOffPolicy,
  TimeOffRequest,
  OnboardingTemplate,
  OnboardingTask,
  EmployeeOnboarding,
  ReviewCycle,
  Review,
  Notification,
  EmailEvent,
  PendingSignup,
  MockInvite,
} from "@/types/peoplecore";

// Deep clone to avoid mutation of seed constants
function clone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

// ============================================================
// Mutable State
// ============================================================

const companies: Company[] = [clone(seed.company)];
const departments: Department[] = clone(seed.departments);
const employees: Employee[] = clone(seed.employees);
const authUsers: AuthUser[] = clone(seed.authUsers);
const payrollRuns: PayrollRun[] = clone(seed.payrollRuns);
const payslips: Payslip[] = clone(seed.payslips);
const timeOffPolicy: TimeOffPolicy = clone(seed.timeOffPolicy);
const timeOffRequests: TimeOffRequest[] = clone(seed.timeOffRequests);
const onboardingTemplates: OnboardingTemplate[] = clone(seed.onboardingTemplates);
const onboardingTasks: OnboardingTask[] = clone(seed.onboardingTasks);
const employeeOnboardings: EmployeeOnboarding[] = clone(seed.employeeOnboardings);
const reviewCycles: ReviewCycle[] = clone(seed.reviewCycles);
const reviews: Review[] = clone(seed.reviews);
let notifications: Notification[] = clone(seed.notifications);
const emailEvents: EmailEvent[] = clone(seed.emailEvents);
const pendingSignups: PendingSignup[] = [];
const invites: MockInvite[] = [];

// ============================================================
// ID Generator
// ============================================================

export function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

// ============================================================
// Company
// ============================================================

export const db = {
  // --- Company ---
  getCompany: () => companies[0],
  getCompanies: () => companies,
  addCompany: (company: Company) => {
    companies.push(company);
    return company;
  },
  updateCompany: (updates: Partial<Company>) => {
    companies[0] = { ...companies[0], ...updates };
    return companies[0];
  },

  // --- Departments ---
  getDepartments: () => departments,
  getDepartmentById: (id: string) => departments.find((d) => d.id === id),

  // --- Employees ---
  getEmployees: () => employees,
  getEmployeeById: (id: string) => employees.find((e) => e.id === id),
  getEmployeeByEmail: (email: string) => employees.find((e) => e.email === email),
  addEmployee: (emp: Employee) => {
    employees.push(emp);
    return emp;
  },
  updateEmployee: (id: string, updates: Partial<Employee>) => {
    const idx = employees.findIndex((e) => e.id === id);
    if (idx === -1) return null;
    employees[idx] = { ...employees[idx], ...updates };
    return employees[idx];
  },

  // --- Auth Users ---
  getAuthUsers: () => authUsers,
  getAuthUserByEmail: (email: string) => authUsers.find((u) => u.email === email),
  getAuthUserById: (id: string) => authUsers.find((u) => u.id === id),
  getAuthUserByEmployeeId: (employeeId: string) =>
    authUsers.find((u) => u.employeeId === employeeId),
  addAuthUser: (user: AuthUser) => {
    authUsers.push(user);
    return user;
  },

  // --- Pending signups and invites ---
  getPendingSignupByEmail: (email: string) =>
    pendingSignups.find((signup) => signup.email.toLowerCase() === email.toLowerCase()),
  addPendingSignup: (signup: PendingSignup) => {
    const existing = pendingSignups.findIndex((item) => item.email.toLowerCase() === signup.email.toLowerCase());
    if (existing >= 0) pendingSignups.splice(existing, 1, signup);
    else pendingSignups.push(signup);
    return signup;
  },
  deletePendingSignup: (id: string) => {
    const index = pendingSignups.findIndex((signup) => signup.id === id);
    if (index >= 0) pendingSignups.splice(index, 1);
  },
  getInviteByToken: (token: string) => invites.find((invite) => invite.token === token),
  getInviteByEmail: (email: string) =>
    invites.find((invite) => invite.email.toLowerCase() === email.toLowerCase() && !invite.acceptedAt),
  addInvite: (invite: MockInvite) => {
    invites.push(invite);
    return invite;
  },
  updateInvite: (id: string, updates: Partial<MockInvite>) => {
    const index = invites.findIndex((invite) => invite.id === id);
    if (index === -1) return null;
    invites[index] = { ...invites[index], ...updates };
    return invites[index];
  },
  updateAuthUser: (id: string, updates: Partial<AuthUser>) => {
    const idx = authUsers.findIndex((u) => u.id === id);
    if (idx === -1) return null;
    authUsers[idx] = { ...authUsers[idx], ...updates };
    return authUsers[idx];
  },

  // --- Payroll Runs ---
  getPayrollRuns: () => payrollRuns,
  getPayrollRunById: (id: string) => payrollRuns.find((r) => r.id === id),
  addPayrollRun: (run: PayrollRun) => {
    payrollRuns.push(run);
    return run;
  },
  updatePayrollRun: (id: string, updates: Partial<PayrollRun>) => {
    const idx = payrollRuns.findIndex((r) => r.id === id);
    if (idx === -1) return null;
    payrollRuns[idx] = { ...payrollRuns[idx], ...updates };
    return payrollRuns[idx];
  },

  // --- Payslips ---
  getPayslips: () => payslips,
  getPayslipsByEmployee: (employeeId: string) =>
    payslips.filter((p) => p.employeeId === employeeId),
  getPayslipsByRun: (runId: string) =>
    payslips.filter((p) => p.payrollRunId === runId),
  addPayslip: (slip: Payslip) => {
    payslips.push(slip);
    return slip;
  },

  // --- Time Off Policy ---
  getTimeOffPolicy: () => timeOffPolicy,

  // --- Time Off Requests ---
  getTimeOffRequests: () => timeOffRequests,
  getTimeOffRequestById: (id: string) => timeOffRequests.find((r) => r.id === id),
  getTimeOffRequestsByEmployee: (employeeId: string) =>
    timeOffRequests.filter((r) => r.employeeId === employeeId),
  getTimeOffRequestsByManager: (managerId: string) =>
    timeOffRequests.filter((r) => r.managerId === managerId),
  addTimeOffRequest: (req: TimeOffRequest) => {
    timeOffRequests.push(req);
    return req;
  },
  updateTimeOffRequest: (id: string, updates: Partial<TimeOffRequest>) => {
    const idx = timeOffRequests.findIndex((r) => r.id === id);
    if (idx === -1) return null;
    timeOffRequests[idx] = { ...timeOffRequests[idx], ...updates };
    return timeOffRequests[idx];
  },

  // --- Onboarding Templates ---
  getOnboardingTemplates: () => onboardingTemplates,
  getOnboardingTemplateById: (id: string) =>
    onboardingTemplates.find((t) => t.id === id),
  addOnboardingTemplate: (template: OnboardingTemplate) => {
    onboardingTemplates.push(template);
    return template;
  },
  updateOnboardingTemplate: (id: string, updates: Partial<OnboardingTemplate>) => {
    const idx = onboardingTemplates.findIndex((t) => t.id === id);
    if (idx === -1) return null;
    onboardingTemplates[idx] = { ...onboardingTemplates[idx], ...updates };
    return onboardingTemplates[idx];
  },

  // --- Onboarding Tasks ---
  getOnboardingTasks: () => onboardingTasks,
  getOnboardingTaskById: (id: string) => onboardingTasks.find((t) => t.id === id),
  getOnboardingTasksByTemplate: (templateId: string) =>
    onboardingTasks.filter((t) => t.templateId === templateId),
  addOnboardingTask: (task: OnboardingTask) => {
    onboardingTasks.push(task);
    return task;
  },

  // --- Employee Onboardings ---
  getEmployeeOnboardings: () => employeeOnboardings,
  getOnboardingByEmployee: (employeeId: string) =>
    employeeOnboardings.find((o) => o.employeeId === employeeId),
  addEmployeeOnboarding: (onboarding: EmployeeOnboarding) => {
    employeeOnboardings.push(onboarding);
    return onboarding;
  },
  updateEmployeeOnboarding: (id: string, updates: Partial<EmployeeOnboarding>) => {
    const idx = employeeOnboardings.findIndex((o) => o.id === id);
    if (idx === -1) return null;
    employeeOnboardings[idx] = { ...employeeOnboardings[idx], ...updates };
    return employeeOnboardings[idx];
  },

  // --- Review Cycles ---
  getReviewCycles: () => reviewCycles,
  getReviewCycleById: (id: string) => reviewCycles.find((c) => c.id === id),
  addReviewCycle: (cycle: ReviewCycle) => {
    reviewCycles.push(cycle);
    return cycle;
  },
  updateReviewCycle: (id: string, updates: Partial<ReviewCycle>) => {
    const idx = reviewCycles.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    reviewCycles[idx] = { ...reviewCycles[idx], ...updates };
    return reviewCycles[idx];
  },

  // --- Reviews ---
  getReviews: () => reviews,
  getReviewById: (id: string) => reviews.find((r) => r.id === id),
  getReviewsByEmployee: (employeeId: string) =>
    reviews.filter((r) => r.employeeId === employeeId),
  getReviewsByReviewer: (reviewerId: string) =>
    reviews.filter((r) => r.reviewerId === reviewerId),
  getReviewsByCycle: (cycleId: string) =>
    reviews.filter((r) => r.cycleId === cycleId),
  addReview: (review: Review) => {
    reviews.push(review);
    return review;
  },
  updateReview: (id: string, updates: Partial<Review>) => {
    const idx = reviews.findIndex((r) => r.id === id);
    if (idx === -1) return null;
    reviews[idx] = { ...reviews[idx], ...updates };
    return reviews[idx];
  },

  // --- Notifications ---
  getNotifications: () => notifications,
  getNotificationsByUser: (userId: string) =>
    notifications
      .filter((n) => n.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
  addNotification: (notif: Notification) => {
    notifications.unshift(notif);
    return notif;
  },
  markAllNotificationsRead: (userId: string) => {
    notifications = notifications.map((n) =>
      n.userId === userId ? { ...n, read: true } : n
    );
  },
  markNotificationRead: (id: string) => {
    const idx = notifications.findIndex((n) => n.id === id);
    if (idx !== -1) notifications[idx] = { ...notifications[idx], read: true };
  },

  // --- Email Events ---
  getEmailEvents: () => emailEvents,
  addEmailEvent: (event: EmailEvent) => {
    emailEvents.push(event);
    return event;
  },
};
