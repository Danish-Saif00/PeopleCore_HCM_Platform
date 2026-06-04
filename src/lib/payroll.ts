import { db, generateId } from '@/data/mock-db';
import type { PayrollRun, Payslip } from '@/types/peoplecore';
import { createNotification } from './notifications';

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
  // Simulate occasional failure (for demo failure modal)
  const employees = db.getEmployees().filter((e) => e.status === 'Active');
  if (employees.length === 0) {
    return { success: false, error: 'No active employees found.' };
  }
  const runId = generateId('payroll');
  const now = new Date().toISOString();
  const totalAmount = employees.reduce((sum, e) => sum + e.baseSalary, 0);
  const run: PayrollRun = {
    id: runId,
    companyId: input.companyId ?? 'company_001',
    period: input.period,
    status: 'Completed',
    totalAmount,
    runAt: now,
    employeeCount: employees.length,
    dateFrom: input.dateFrom,
    dateTo: input.dateTo,
  };
  db.addPayrollRun(run);
  const generatedPayslips: Payslip[] = employees.map((emp) => {
    const tax = Math.round(emp.baseSalary * 0.2);
    const insurance = Math.round(emp.baseSalary * 0.016);
    const slip: Payslip = {
      id: generateId('payslip'),
      payrollRunId: runId,
      employeeId: emp.id,
      grossPay: emp.baseSalary,
      deductions: { tax, insurance },
      netPay: emp.baseSalary - tax - insurance,
      month: input.period,
    };
    db.addPayslip(slip);
    const authUser = db.getAuthUserByEmployeeId(emp.id);
    if (authUser) {
      createNotification({
        userId: authUser.id,
        employeeId: emp.id,
        title: 'Payslip available',
        message: `Your ${input.period} payslip is ready to view.`,
        type: 'Payroll',
      });
    }
    return slip;
  });
  return { success: true, run, payslips: generatedPayslips };
}

export function getPayslipsForEmployee(employeeId: string): Payslip[] {
  return db.getPayslipsByEmployee(employeeId).sort(
    (a, b) => new Date(b.month).getTime() - new Date(a.month).getTime()
  );
}

export function getPayslipsByRun(runId: string): Payslip[] {
  return db.getPayslipsByRun(runId);
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
