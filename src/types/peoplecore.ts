// ============================================================
// PeopleCore HCM — TypeScript Types
// ============================================================

export type Role = "Guest" | "Employee" | "Manager" | "HR Admin" | "Super Admin";

export type EmployeeStatus = "Active" | "Inactive" | "On Leave" | "Terminated";
export type EmploymentType = "Full-time" | "Part-time" | "Contract" | "Intern";

// ============================================================
// Company & Department
// ============================================================

export interface Company {
  id: string;
  name: string;
  subdomain: string;
  country: string;
  createdAt: string;
}

export interface Department {
  id: string;
  companyId: string;
  name: string;
  headEmployeeId: string;
}

// ============================================================
// Employee
// ============================================================

export interface Employee {
  id: string;
  companyId: string;
  managerId: string | null;
  fullName: string;
  email: string;
  phone: string;
  department: string;
  departmentId: string;
  jobTitle: string;
  startDate: string;
  status: EmployeeStatus;
  employmentType: EmploymentType;
  avatarUrl: string;
  baseSalary: number;
  role: Role;
}

// ============================================================
// Auth
// ============================================================

export interface AuthUser {
  id: string;
  employeeId: string;
  email: string;
  password: string;
  role: Role;
  failedLoginAttempts: number;
  locked: boolean;
  verified: boolean;
  lastActivity?: string;
}

export interface AuthSession {
  userId: string;
  employeeId: string;
  email: string;
  role: Role;
  expiresAt: string;
  lastActivity: string;
}

export interface DemoCredential {
  label: string;
  email: string;
  password: string;
}

// ============================================================
// Payroll
// ============================================================

export type PayrollStatus = "Pending" | "Processing" | "Completed" | "Failed";

export interface PayrollRun {
  id: string;
  companyId: string;
  period: string;
  status: PayrollStatus;
  totalAmount: number;
  runAt: string | null;
  employeeCount?: number;
  dateFrom?: string;
  dateTo?: string;
}

export interface PayslipDeductions {
  tax: number;
  insurance: number;
  other?: number;
}

export interface Payslip {
  id: string;
  payrollRunId: string;
  employeeId: string;
  grossPay: number;
  deductions: PayslipDeductions;
  netPay: number;
  month: string;
}

// ============================================================
// Time Off
// ============================================================

export type TimeOffType = "Annual Leave" | "Sick Leave" | "Unpaid";
export type TimeOffStatus = "Pending" | "Approved" | "Rejected" | "Cancelled";

export interface TimeOffPolicy {
  id: string;
  companyId: string;
  types: TimeOffType[];
  daysAllowed: Record<TimeOffType, number>;
}

export interface TimeOffRequest {
  id: string;
  employeeId: string;
  type: TimeOffType;
  startDate: string;
  endDate: string;
  status: TimeOffStatus;
  managerId: string;
  note: string;
  managerNote: string;
  createdAt: string;
}

// ============================================================
// Onboarding
// ============================================================

export type OnboardingTaskRole = "Employee" | "IT" | "HR";

export interface OnboardingTemplate {
  id: string;
  companyId: string;
  name: string;
  taskIds: string[];
}

export interface OnboardingTask {
  id: string;
  templateId: string;
  title: string;
  description: string;
  dueOffsetDays: number;
  assignedRole: OnboardingTaskRole;
}

export interface EmployeeOnboarding {
  id: string;
  employeeId: string;
  templateId: string;
  completedTasks: string[];
  startedAt: string;
}

// ============================================================
// Performance Reviews
// ============================================================

export type ReviewStatus = "Pending" | "In Progress" | "Completed";
export type ReviewCycleStatus = "Draft" | "In Progress" | "Completed";

export interface ReviewCycle {
  id: string;
  companyId: string;
  name: string;
  period: string;
  employeeIds: string[];
  createdBy: string;
  status: ReviewCycleStatus;
}

export interface ReviewRatings {
  overall: number | null;
  communication?: number | null;
  collaboration?: number | null;
  delivery?: number | null;
}

export interface Review {
  id: string;
  cycleId: string;
  employeeId: string;
  reviewerId: string;
  period: string;
  ratings: ReviewRatings;
  strengths: string;
  areasOfImprovement: string;
  goals: string;
  comment: string;
  status: ReviewStatus;
  submittedAt: string | null;
}

// ============================================================
// Notifications
// ============================================================

export type NotificationType = "Payroll" | "Time Off" | "Reviews" | "Onboarding" | "System";

export interface Notification {
  id: string;
  userId: string;
  employeeId: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
}

// ============================================================
// Email Events (mock)
// ============================================================

export type EmailEventType =
  | "verification"
  | "invite"
  | "payslip_ready"
  | "time_off_submitted"
  | "time_off_approved"
  | "time_off_rejected"
  | "review_assigned"
  | "review_submitted"
  | "onboarding_assigned";

export interface EmailEvent {
  id: string;
  to: string;
  type: EmailEventType;
  subject: string;
  body: string;
  sentAt: string;
  status: "sent" | "failed";
}

// ============================================================
// API Response Types
// ============================================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// ============================================================
// UI / Form Types
// ============================================================

export interface SelectOption {
  value: string;
  label: string;
}

export interface TableColumn<T> {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
  mobileLabel?: string;
  hideOnMobile?: boolean;
}

export interface FilterState {
  search?: string;
  department?: string;
  status?: string;
  type?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortDir?: "asc" | "desc";
}
