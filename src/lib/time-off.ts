import { db, generateId } from '@/data/mock-db';
import type { TimeOffRequest, TimeOffStatus, TimeOffType } from '@/types/peoplecore';
import { createNotification } from './notifications';
import { logMockEmail } from './email-events';

export function getRequestsForEmployee(employeeId: string): TimeOffRequest[] {
  return db.getTimeOffRequestsByEmployee(employeeId).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getRequestsForManager(managerId: string): TimeOffRequest[] {
  return db.getTimeOffRequestsByManager(managerId).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getAllRequests(): TimeOffRequest[] {
  return db.getTimeOffRequests().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export interface CreateTimeOffInput {
  employeeId: string;
  type: TimeOffType;
  startDate: string;
  endDate: string;
  note: string;
  managerId: string;
}

export function createRequest(input: CreateTimeOffInput): TimeOffRequest {
  const req: TimeOffRequest = {
    id: generateId('tor'),
    ...input,
    status: 'Pending',
    managerNote: '',
    createdAt: new Date().toISOString(),
  };
  db.addTimeOffRequest(req);
  const employee = db.getEmployeeById(input.employeeId);
  const managerAuth = db.getAuthUserByEmployeeId(input.managerId);
  if (managerAuth && employee) {
    createNotification({
      userId: managerAuth.id,
      employeeId: input.managerId,
      title: 'Time-off request pending',
      message: `${employee.fullName} requested ${input.type} from ${input.startDate} to ${input.endDate}.`,
      type: 'Time Off',
    });
    const manager = db.getEmployeeById(input.managerId);
    if (manager) logMockEmail(manager.email, 'time_off_submitted', `New time-off request from ${employee.fullName}`, `${employee.fullName} requested ${input.type}.`);
  }
  return req;
}

export function approveRequest(id: string, managerNote = ''): TimeOffRequest | null {
  const req = db.getTimeOffRequestById(id);
  if (!req) return null;
  const updated = db.updateTimeOffRequest(id, { status: 'Approved', managerNote });
  if (updated) {
    const empAuth = db.getAuthUserByEmployeeId(req.employeeId);
    if (empAuth) {
      createNotification({
        userId: empAuth.id,
        employeeId: req.employeeId,
        title: 'Time-off approved',
        message: `Your ${req.type} request (${req.startDate} - ${req.endDate}) has been approved.`,
        type: 'Time Off',
      });
      const employee = db.getEmployeeById(req.employeeId);
      if (employee) logMockEmail(employee.email, 'time_off_approved', 'Time-off request approved', `Your ${req.type} request was approved.`);
    }
  }
  return updated;
}

export function rejectRequest(id: string, managerNote = ''): TimeOffRequest | null {
  const req = db.getTimeOffRequestById(id);
  if (!req) return null;
  const updated = db.updateTimeOffRequest(id, { status: 'Rejected', managerNote });
  if (updated) {
    const empAuth = db.getAuthUserByEmployeeId(req.employeeId);
    if (empAuth) {
      createNotification({
        userId: empAuth.id,
        employeeId: req.employeeId,
        title: 'Time-off request rejected',
        message: `Your ${req.type} request (${req.startDate} - ${req.endDate}) has been rejected.`,
        type: 'Time Off',
      });
      const employee = db.getEmployeeById(req.employeeId);
      if (employee) logMockEmail(employee.email, 'time_off_rejected', 'Time-off request rejected', `Your ${req.type} request was rejected.`);
    }
  }
  return updated;
}

export function getPolicy() {
  return db.getTimeOffPolicy();
}

export function getDaysUsed(employeeId: string, type: TimeOffType): number {
  const requests = db
    .getTimeOffRequestsByEmployee(employeeId)
    .filter((r) => r.type === type && r.status === 'Approved');
  return requests.reduce((sum, r) => {
    const start = new Date(r.startDate);
    const end = new Date(r.endDate);
    const days =
      Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return sum + days;
  }, 0);
}
