import { db, generateId } from '@/data/mock-db';
import type { OnboardingTemplate, OnboardingTask, EmployeeOnboarding } from '@/types/peoplecore';
import { createNotification } from './notifications';
import { logMockEmail } from './email-events';

export function getTemplates(): OnboardingTemplate[] {
  return db.getOnboardingTemplates();
}

export function getTemplateById(id: string): OnboardingTemplate | undefined {
  return db.getOnboardingTemplateById(id);
}

export function getTasksForTemplate(templateId: string): OnboardingTask[] {
  const template = db.getOnboardingTemplateById(templateId);
  if (!template) return [];

  return template.taskIds
    .map((taskId) => db.getOnboardingTaskById(taskId))
    .filter((task): task is OnboardingTask => Boolean(task));
}

export function getAllOnboardings(): EmployeeOnboarding[] {
  return db.getEmployeeOnboardings();
}

export function getOnboardingForEmployee(employeeId: string): EmployeeOnboarding | undefined {
  return db.getOnboardingByEmployee(employeeId);
}

export interface CreateTemplateInput {
  name: string;
  companyId?: string;
  tasks: Array<{
    title: string;
    description: string;
    dueOffsetDays: number;
    assignedRole: 'Employee' | 'IT' | 'HR';
  }>;
}

export function createTemplate(input: CreateTemplateInput): OnboardingTemplate {
  const templateId = generateId('template');
  const taskIds: string[] = input.tasks.map((t) => {
    const taskId = generateId('task');
    const task: OnboardingTask = {
      id: taskId,
      templateId,
      title: t.title,
      description: t.description,
      dueOffsetDays: t.dueOffsetDays,
      assignedRole: t.assignedRole,
    };
    db.addOnboardingTask(task);
    return taskId;
  });
  const template: OnboardingTemplate = {
    id: templateId,
    companyId: input.companyId ?? 'company_001',
    name: input.name,
    taskIds,
  };
  db.addOnboardingTemplate(template);
  return template;
}

export function assignTemplate(
  employeeId: string,
  templateId: string
): EmployeeOnboarding {
  const existing = db.getOnboardingByEmployee(employeeId);
  if (existing) return existing;
  const onboarding: EmployeeOnboarding = {
    id: generateId('onboarding'),
    employeeId,
    templateId,
    completedTasks: [],
    startedAt: new Date().toISOString(),
  };
  db.addEmployeeOnboarding(onboarding);
  const empAuth = db.getAuthUserByEmployeeId(employeeId);
  const emp = db.getEmployeeById(employeeId);
  if (empAuth && emp) {
    createNotification({
      userId: empAuth.id,
      employeeId,
      title: 'Onboarding checklist assigned',
      message: 'Your onboarding checklist is ready. Complete your tasks to get started.',
      type: 'Onboarding',
    });
    logMockEmail(emp.email, 'onboarding_assigned', 'Onboarding checklist assigned', 'Your onboarding checklist is ready.');
  }
  return onboarding;
}

export function completeTask(
  employeeId: string,
  taskId: string
): EmployeeOnboarding | null {
  const onboarding = db.getOnboardingByEmployee(employeeId);
  if (!onboarding) return null;
  if (onboarding.completedTasks.includes(taskId)) return onboarding;
  return db.updateEmployeeOnboarding(onboarding.id, {
    completedTasks: [...onboarding.completedTasks, taskId],
  });
}

export function getProgress(onboarding: EmployeeOnboarding): {
  completed: number;
  total: number;
  percentage: number;
} {
  const template = db.getOnboardingTemplateById(onboarding.templateId);
  if (!template) return { completed: 0, total: 0, percentage: 0 };
  const total = template.taskIds.length;
  const completed = onboarding.completedTasks.length;
  return {
    completed,
    total,
    percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
  };
}
