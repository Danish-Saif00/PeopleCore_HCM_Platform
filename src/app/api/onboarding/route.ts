import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getTemplates, getAllOnboardings, createTemplate, getOnboardingForEmployee, completeTask, getTasksForTemplate } from '@/lib/onboarding';
import { db } from '@/data/mock-db';

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const view = searchParams.get('view') ?? 'mine';
  if (view === 'templates') {
    const templates = getTemplates().map((t) => ({
      ...t,
      tasks: getTasksForTemplate(t.id),
    }));
    return NextResponse.json({ success: true, data: templates });
  }
  if (view === 'all') {
    const onboardings = getAllOnboardings().map((o) => ({
      ...o,
      employee: db.getEmployeeById(o.employeeId),
      template: db.getOnboardingTemplateById(o.templateId),
    }));
    return NextResponse.json({ success: true, data: onboardings });
  }
  const onboarding = getOnboardingForEmployee(session.employeeId);
  if (!onboarding) return NextResponse.json({ success: true, data: null });
  const template = db.getOnboardingTemplateById(onboarding.templateId);
  const tasks = template ? getTasksForTemplate(template.id) : [];
  return NextResponse.json({ success: true, data: { ...onboarding, template, tasks } });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  if (body.action === 'create-template') {
    const template = createTemplate({ name: body.name, tasks: body.tasks });
    return NextResponse.json({ success: true, data: template });
  }
  if (body.action === 'complete-task') {
    const result = completeTask(session.employeeId, body.taskId);
    return NextResponse.json({ success: !!result, data: result });
  }
  return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
}
