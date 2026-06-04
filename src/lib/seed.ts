import type {
  Company, Department, Employee, PayrollRun, Payslip,
  TimeOffRequest, OnboardingTemplate, EmployeeOnboarding,
  Review, ReviewCycle, Notification, AuthUser, EmailEvent,
} from "./types";

const company: Company = {
  id: "co-1",
  name: "Northwind Labs",
  subdomain: "northwind",
  country: "United States",
  createdAt: "2024-01-15T10:00:00Z",
};

const avatar = (seed: string) => `https://i.pravatar.cc/150?u=${seed}`;

export const seedCompany = company;

export const seedDepartments: Department[] = [
  { id: "dep-eng", companyId: company.id, name: "Engineering", headEmployeeId: "emp-2" },
  { id: "dep-design", companyId: company.id, name: "Design", headEmployeeId: "emp-4" },
  { id: "dep-hr", companyId: company.id, name: "People & HR", headEmployeeId: "emp-3" },
  { id: "dep-sales", companyId: company.id, name: "Sales", headEmployeeId: "emp-6" },
  { id: "dep-finance", companyId: company.id, name: "Finance", headEmployeeId: "emp-7" },
];

export const seedEmployees: Employee[] = [
  {
    id: "emp-1", companyId: company.id, managerId: null,
    fullName: "Aaron Loeb", email: "aaron@northwind.com", phone: "+1 415 555 0100",
    department: "Executive", jobTitle: "CEO", startDate: "2019-03-01",
    status: "active", avatarUrl: avatar("aaron"), role: "super_admin", daysOffRemaining: 18,
  },
  {
    id: "emp-2", companyId: company.id, managerId: "emp-1",
    fullName: "Daniel Gallego", email: "daniel@northwind.com", phone: "+1 415 555 0101",
    department: "Engineering", jobTitle: "CTO", startDate: "2019-06-12",
    status: "active", avatarUrl: avatar("daniel"), role: "manager", daysOffRemaining: 12,
  },
  {
    id: "emp-3", companyId: company.id, managerId: "emp-1",
    fullName: "Halima Fayed", email: "halima@northwind.com", phone: "+1 415 555 0102",
    department: "People & HR", jobTitle: "Head of People", startDate: "2020-01-08",
    status: "active", avatarUrl: avatar("halima"), role: "hr_admin", daysOffRemaining: 14,
  },
  {
    id: "emp-4", companyId: company.id, managerId: "emp-1",
    fullName: "Chidi Eze", email: "chidi@northwind.com", phone: "+1 415 555 0103",
    department: "Design", jobTitle: "Head of Design", startDate: "2020-05-20",
    status: "active", avatarUrl: avatar("chidi"), role: "manager", daysOffRemaining: 10,
  },
  {
    id: "emp-5", companyId: company.id, managerId: "emp-2",
    fullName: "Wade Warren", email: "wade@northwind.com", phone: "+1 415 555 0104",
    department: "Engineering", jobTitle: "Senior Engineer", startDate: "2021-02-14",
    status: "active", avatarUrl: avatar("wade"), role: "employee", daysOffRemaining: 8,
  },
  {
    id: "emp-6", companyId: company.id, managerId: "emp-1",
    fullName: "Floyd Miles", email: "floyd@northwind.com", phone: "+1 415 555 0105",
    department: "Sales", jobTitle: "VP Sales", startDate: "2020-11-02",
    status: "active", avatarUrl: avatar("floyd"), role: "manager", daysOffRemaining: 7,
  },
  {
    id: "emp-7", companyId: company.id, managerId: "emp-1",
    fullName: "Jane Cooper", email: "jane@northwind.com", phone: "+1 415 555 0106",
    department: "Finance", jobTitle: "CFO", startDate: "2019-09-09",
    status: "active", avatarUrl: avatar("jane"), role: "manager", daysOffRemaining: 11,
  },
  {
    id: "emp-8", companyId: company.id, managerId: "emp-2",
    fullName: "Jenny Wilson", email: "jenny@northwind.com", phone: "+1 415 555 0107",
    department: "Engineering", jobTitle: "Engineer", startDate: "2022-06-01",
    status: "active", avatarUrl: avatar("jenny"), role: "employee", daysOffRemaining: 15,
  },
  {
    id: "emp-9", companyId: company.id, managerId: "emp-4",
    fullName: "Guy Hawkins", email: "guy@northwind.com", phone: "+1 415 555 0108",
    department: "Design", jobTitle: "Product Designer", startDate: "2022-08-22",
    status: "active", avatarUrl: avatar("guy"), role: "employee", daysOffRemaining: 12,
  },
  {
    id: "emp-10", companyId: company.id, managerId: "emp-6",
    fullName: "Arlene McCoy", email: "arlene@northwind.com", phone: "+1 415 555 0109",
    department: "Sales", jobTitle: "Account Executive", startDate: "2023-03-15",
    status: "active", avatarUrl: avatar("arlene"), role: "employee", daysOffRemaining: 16,
  },
  {
    id: "emp-11", companyId: company.id, managerId: "emp-7",
    fullName: "Jerome Bell", email: "jerome@northwind.com", phone: "+1 415 555 0110",
    department: "Finance", jobTitle: "Accountant", startDate: "2023-09-04",
    status: "active", avatarUrl: avatar("jerome"), role: "employee", daysOffRemaining: 19,
  },
  {
    id: "emp-12", companyId: company.id, managerId: "emp-4",
    fullName: "Albert Flores", email: "albert@northwind.com", phone: "+1 415 555 0111",
    department: "Design", jobTitle: "Illustrator", startDate: "2024-02-19",
    status: "inactive", avatarUrl: avatar("albert"), role: "employee", daysOffRemaining: 5,
  },
];

export const seedAuthUsers: AuthUser[] = seedEmployees.map((e) => ({
  id: `auth-${e.id}`,
  employeeId: e.id,
  email: e.email,
  role: e.role,
  companyId: e.companyId,
  failedAttempts: 0,
  locked: false,
}));

// Demo password for every seeded user
export const DEMO_PASSWORD = "peoplecore";

const today = new Date();
const isoDaysAgo = (d: number) => {
  const x = new Date(today);
  x.setDate(x.getDate() - d);
  return x.toISOString();
};
const isoDaysAhead = (d: number) => {
  const x = new Date(today);
  x.setDate(x.getDate() + d);
  return x.toISOString();
};

export const seedPayrollRuns: PayrollRun[] = [
  { id: "pr-1", companyId: company.id, periodStart: "2025-01-01", periodEnd: "2025-01-31", status: "completed", totalAmount: 184500, runAt: "2025-02-01T09:00:00Z" },
  { id: "pr-2", companyId: company.id, periodStart: "2025-02-01", periodEnd: "2025-02-28", status: "completed", totalAmount: 186200, runAt: "2025-03-01T09:00:00Z" },
  { id: "pr-3", companyId: company.id, periodStart: "2025-03-01", periodEnd: "2025-03-31", status: "completed", totalAmount: 188400, runAt: "2025-04-01T09:00:00Z" },
];

const buildPayslips = (): Payslip[] => {
  const list: Payslip[] = [];
  for (const run of seedPayrollRuns) {
    for (const emp of seedEmployees) {
      const gross = 5000 + (emp.id.charCodeAt(emp.id.length - 1) % 5) * 800;
      const tax = Math.round(gross * 0.18);
      const insurance = 120;
      const net = gross - tax - insurance;
      list.push({
        id: `ps-${run.id}-${emp.id}`,
        payrollRunId: run.id,
        employeeId: emp.id,
        periodStart: run.periodStart,
        periodEnd: run.periodEnd,
        grossPay: gross,
        taxDeduction: tax,
        insurance,
        otherDeductions: 0,
        netPay: net,
      });
    }
  }
  return list;
};
export const seedPayslips = buildPayslips();

export const seedTimeOff: TimeOffRequest[] = [
  { id: "to-1", employeeId: "emp-5", managerId: "emp-2", type: "annual", startDate: isoDaysAhead(10), endDate: isoDaysAhead(14), status: "pending", note: "Family trip", createdAt: isoDaysAgo(1) },
  { id: "to-2", employeeId: "emp-8", managerId: "emp-2", type: "sick", startDate: isoDaysAgo(2), endDate: isoDaysAgo(2), status: "approved", note: "Flu", createdAt: isoDaysAgo(3) },
  { id: "to-3", employeeId: "emp-9", managerId: "emp-4", type: "annual", startDate: isoDaysAhead(20), endDate: isoDaysAhead(25), status: "pending", note: "Vacation", createdAt: isoDaysAgo(1) },
  { id: "to-4", employeeId: "emp-10", managerId: "emp-6", type: "unpaid", startDate: isoDaysAgo(15), endDate: isoDaysAgo(13), status: "rejected", note: "Personal", managerNote: "Conflicts with launch", createdAt: isoDaysAgo(20) },
  { id: "to-5", employeeId: "emp-11", managerId: "emp-7", type: "annual", startDate: isoDaysAhead(5), endDate: isoDaysAhead(7), status: "approved", note: "Wedding", createdAt: isoDaysAgo(8) },
];

export const seedOnboardingTemplates: OnboardingTemplate[] = [
  {
    id: "tpl-1", companyId: company.id, name: "Standard New Hire",
    tasks: [
      { id: "t-1", templateId: "tpl-1", title: "Sign offer letter", description: "Review and sign the offer letter via DocuSign.", dueOffsetDays: 0, assignedRole: "employee" },
      { id: "t-2", templateId: "tpl-1", title: "Provision laptop", description: "IT provisions a MacBook Pro.", dueOffsetDays: 1, assignedRole: "it" },
      { id: "t-3", templateId: "tpl-1", title: "Setup accounts", description: "Email, Slack, GitHub, Notion access.", dueOffsetDays: 1, assignedRole: "it" },
      { id: "t-4", templateId: "tpl-1", title: "Welcome meeting", description: "Intro session with team lead and HR.", dueOffsetDays: 2, assignedRole: "hr" },
      { id: "t-5", templateId: "tpl-1", title: "Complete tax forms", description: "Submit W-4 and direct deposit info.", dueOffsetDays: 5, assignedRole: "employee" },
      { id: "t-6", templateId: "tpl-1", title: "Read employee handbook", description: "Review the company handbook and policies.", dueOffsetDays: 7, assignedRole: "employee" },
    ],
  },
];

const buildOnboarding = (): EmployeeOnboarding[] => {
  const tpl = seedOnboardingTemplates[0];
  const wade = seedEmployees.find((e) => e.id === "emp-5")!;
  const jenny = seedEmployees.find((e) => e.id === "emp-8")!;
  const make = (emp: Employee, completedCount: number): EmployeeOnboarding => {
    const start = new Date(emp.startDate);
    return {
      id: `eo-${emp.id}`,
      employeeId: emp.id,
      templateId: tpl.id,
      startedAt: emp.startDate,
      tasks: tpl.tasks.map((t, idx) => {
        const d = new Date(start);
        d.setDate(d.getDate() + t.dueOffsetDays);
        return {
          taskId: t.id, title: t.title, description: t.description,
          assignedRole: t.assignedRole, dueDate: d.toISOString(),
          completed: idx < completedCount,
        };
      }),
    };
  };
  return [make(wade, 6), make(jenny, 3)];
};
export const seedEmployeeOnboarding = buildOnboarding();

export const seedReviewCycles: ReviewCycle[] = [
  { id: "rc-1", companyId: company.id, name: "Q1 2025 Review", period: "Jan – Mar 2025", employeeIds: ["emp-5", "emp-8", "emp-9", "emp-10", "emp-11"], createdAt: "2025-03-15T00:00:00Z" },
];

export const seedReviews: Review[] = [
  { id: "rv-1", cycleId: "rc-1", cycleName: "Q1 2025 Review", employeeId: "emp-5", reviewerId: "emp-2", period: "Jan – Mar 2025", rating: 4, strengths: "Strong technical execution and mentorship.", improvements: "Could improve cross-team communication.", goals: "Lead the new payments module rollout.", status: "submitted", submittedAt: isoDaysAgo(5) },
  { id: "rv-2", cycleId: "rc-1", cycleName: "Q1 2025 Review", employeeId: "emp-8", reviewerId: "emp-2", period: "Jan – Mar 2025", status: "pending" },
  { id: "rv-3", cycleId: "rc-1", cycleName: "Q1 2025 Review", employeeId: "emp-9", reviewerId: "emp-4", period: "Jan – Mar 2025", status: "pending" },
  { id: "rv-4", cycleId: "rc-1", cycleName: "Q1 2025 Review", employeeId: "emp-10", reviewerId: "emp-6", period: "Jan – Mar 2025", status: "pending" },
  { id: "rv-5", cycleId: "rc-1", cycleName: "Q1 2025 Review", employeeId: "emp-11", reviewerId: "emp-7", period: "Jan – Mar 2025", status: "pending" },
];

export const seedNotifications: Notification[] = [
  { id: "n-1", userId: "emp-5", title: "March payslip available", body: "Your payslip for March 2025 has been issued.", read: false, createdAt: isoDaysAgo(1), link: "/app/payslips" },
  { id: "n-2", userId: "emp-2", title: "New time-off request", body: "Wade Warren requested 5 days of annual leave.", read: false, createdAt: isoDaysAgo(1), link: "/app/team" },
  { id: "n-3", userId: "emp-3", title: "Q1 review cycle in progress", body: "3 of 5 reviews are still pending.", read: false, createdAt: isoDaysAgo(2), link: "/app/reviews" },
  { id: "n-4", userId: "emp-5", title: "Welcome to PeopleCore", body: "Your onboarding checklist is ready.", read: true, createdAt: isoDaysAgo(30) },
];

export const seedEmails: EmailEvent[] = [];
