export type Role = "guest" | "employee" | "manager" | "hr_admin" | "super_admin";

export interface Company {
  id: string;
  name: string;
  subdomain: string;
  country: string;
  createdAt: string;
}

export type EmployeeStatus = "active" | "inactive";

export interface Employee {
  id: string;
  companyId: string;
  managerId: string | null;
  fullName: string;
  email: string;
  phone: string;
  department: string;
  jobTitle: string;
  startDate: string;
  status: EmployeeStatus;
  avatarUrl: string;
  role: Role;
  daysOffRemaining: number;
}

export interface Department {
  id: string;
  companyId: string;
  name: string;
  headEmployeeId: string | null;
}

export type PayrollStatus = "draft" | "processing" | "completed" | "failed";

export interface PayrollRun {
  id: string;
  companyId: string;
  periodStart: string;
  periodEnd: string;
  status: PayrollStatus;
  totalAmount: number;
  runAt: string;
}

export interface Payslip {
  id: string;
  payrollRunId: string;
  employeeId: string;
  periodStart: string;
  periodEnd: string;
  grossPay: number;
  taxDeduction: number;
  insurance: number;
  otherDeductions: number;
  netPay: number;
}

export type TimeOffType = "annual" | "sick" | "unpaid";
export type TimeOffStatus = "pending" | "approved" | "rejected";

export interface TimeOffRequest {
  id: string;
  employeeId: string;
  managerId: string | null;
  type: TimeOffType;
  startDate: string;
  endDate: string;
  status: TimeOffStatus;
  note: string;
  managerNote?: string;
  createdAt: string;
}

export interface OnboardingTask {
  id: string;
  templateId: string;
  title: string;
  description: string;
  dueOffsetDays: number;
  assignedRole: "employee" | "it" | "hr";
}

export interface OnboardingTemplate {
  id: string;
  companyId: string;
  name: string;
  tasks: OnboardingTask[];
}

export interface EmployeeOnboardingTask {
  taskId: string;
  title: string;
  description: string;
  assignedRole: "employee" | "it" | "hr";
  dueDate: string;
  completed: boolean;
}

export interface EmployeeOnboarding {
  id: string;
  employeeId: string;
  templateId: string;
  startedAt: string;
  tasks: EmployeeOnboardingTask[];
}

export type ReviewStatus = "pending" | "submitted";

export interface Review {
  id: string;
  cycleId: string;
  cycleName: string;
  employeeId: string;
  reviewerId: string;
  period: string;
  rating?: number;
  strengths?: string;
  improvements?: string;
  goals?: string;
  status: ReviewStatus;
  submittedAt?: string;
}

export interface ReviewCycle {
  id: string;
  companyId: string;
  name: string;
  period: string;
  employeeIds: string[];
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface EmailEvent {
  id: string;
  to: string;
  subject: string;
  body: string;
  sentAt: string;
}

export interface AuthUser {
  id: string;
  employeeId: string;
  email: string;
  role: Role;
  companyId: string;
  failedAttempts: number;
  locked: boolean;
}

export interface Session {
  userId: string;
  expiresAt: number;
}
