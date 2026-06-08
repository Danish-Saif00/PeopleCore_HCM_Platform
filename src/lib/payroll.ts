import { db, generateId } from '@/data/mock-db';
import type { PayrollRun, Payslip } from '@/types/peoplecore';
import { createNotification } from './notifications';
import { logMockEmail } from './email-events';

export function getPayrollRuns(): PayrollRun[] {
  return db.getPayrollRuns().sort(
    (a, b) => new Date(b.runAt ?? 0).getTime() - new Date(a.runAt ?? 0).getTime()
  );
}

export function getPayrollRunById(id: string): PayrollRun | undefined {
  return db.getPayrollRunById(id);
}

export interface RunPayrollInput {
  period: string;
  dateFrom: string;
  dateTo: string;
  companyId?: string;
}

export interface RunPayrollResult {
  success: boolean;
  run?: PayrollRun;
  payslips?: Payslip[];
  error?: string;
}

export function runPayroll(input: RunPayrollInput): RunPayrollResult {
  const period = input.period.trim();
  if (!period || !input.dateFrom || !input.dateTo || input.dateFrom > input.dateTo) {
    return { success: false, error: 'Provide a valid pay period and date range.' };
  }
  const existingRun = db.getPayrollRuns().find(
    (run) => run.period.toLowerCase() === period.toLowerCase() && run.status !== 'Failed'
  );
  if (existingRun && existingRun.status !== 'Pending') {
    return { success: false, error: `Payroll for ${period} is already ${existingRun.status.toLowerCase()}.` };
  }
  const employees = db.getEmployees().filter((e) => e.status === 'Active');
  if (employees.length === 0) {
    return { success: false, error: 'No active employees found.' };
  }
  const runId = existingRun?.id ?? generateId('payroll');
  const now = new Date().toISOString();
  const totalAmount = employees.reduce((sum, e) => sum + e.baseSalary, 0);
  const runData: PayrollRun = {
    id: runId,
    companyId: input.companyId ?? 'company_001',
    period,
    status: 'Completed',
    totalAmount,
    runAt: now,
    employeeCount: employees.length,
    dateFrom: input.dateFrom,
    dateTo: input.dateTo,
  };
  const run = existingRun
    ? db.updatePayrollRun(existingRun.id, runData) ?? runData
    : db.addPayrollRun(runData);
  const generatedPayslips: Payslip[] = employees.map((emp) => {
    const existingPayslip = db.getPayslipsByRun(runId).find((payslip) => payslip.employeeId === emp.id);
    if (existingPayslip) return existingPayslip;
    const tax = Math.round(emp.baseSalary * 0.2);
    const insurance = Math.round(emp.baseSalary * 0.016);
    const slip: Payslip = {
      id: generateId('payslip'),
      payrollRunId: runId,
      employeeId: emp.id,
      grossPay: emp.baseSalary,
      deductions: { tax, insurance },
      netPay: emp.baseSalary - tax - insurance,
      month: period,
    };
    db.addPayslip(slip);
    const authUser = db.getAuthUserByEmployeeId(emp.id);
    if (authUser) {
      createNotification({
        userId: authUser.id,
        employeeId: emp.id,
        title: 'Payslip available',
        message: `Your ${period} payslip is ready to view.`,
        type: 'Payroll',
      });
      logMockEmail(emp.email, 'payslip_ready', `${period} payslip ready`, `Your ${period} payslip is ready to view.`);
    }
    return slip;
  });
  return { success: true, run, payslips: generatedPayslips };
}

export function getPayslipsForEmployee(employeeId: string): Payslip[] {
  return db.getPayslipsByEmployee(employeeId).sort(
    (a, b) => new Date(b.month).getTime() - new Date(a.month).getTime()
  ).filter((payslip) => db.getPayrollRunById(payslip.payrollRunId)?.status === 'Completed');
}

export function getPayslipsByRun(runId: string): Payslip[] {
  const run = db.getPayrollRunById(runId);
  return run?.status === 'Completed' ? db.getPayslipsByRun(runId) : [];
}

export function getAllIssuedPayslips(): Payslip[] {
  return db.getPayslips().filter(
    (payslip) => db.getPayrollRunById(payslip.payrollRunId)?.status === 'Completed'
  );
}

export function getEstimatedGross(): number {
  return db
    .getEmployees()
    .filter((e) => e.status === 'Active')
    .reduce((sum, e) => sum + e.baseSalary, 0);
}

export function getActiveEmployeeCount(): number {
  return db.getEmployees().filter((e) => e.status === 'Active').length;
}
