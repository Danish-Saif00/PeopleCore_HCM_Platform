'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { DataTable } from '@/components/tables/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';
import { CreateTemplateModal } from '@/components/modals/CreateTemplateModal';
import { useAuth } from '@/lib/auth-context';
import { formatDate } from '@/lib/formatters';
import { Clipboard, Plus, CheckCircle, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { SkeletonCard, SkeletonCardGrid } from '@/components/ui/skeleton';

export default function OnboardingPage() {
  const { session, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'checklist' | 'active-runs' | 'templates'>('checklist');
  const [myOnboarding, setMyOnboarding] = useState<any>(null);
  const [activeOnboardings, setActiveOnboardings] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    if (!loading && !session) router.push('/login');
  }, [session, loading, router]);

  const fetchOnboardingData = useCallback(async () => {
    if (!session) return;
    setDataLoading(true);
    try {
      const isHR = ['HR Admin', 'Super Admin'].includes(session.role);
      
      if (isHR) {
        // Fetch active onboardings and templates
        const [activeRes, templatesRes] = await Promise.all([
          fetch('/api/onboarding?view=all'),
          fetch('/api/onboarding?view=templates'),
        ]);
        
        const activeJson = await activeRes.json();
        const templatesJson = await templatesRes.json();
        
        if (activeJson.success) setActiveOnboardings(activeJson.data);
        if (templatesJson.success) setTemplates(templatesJson.data);
        
        setActiveTab('active-runs');
      } else {
        // Fetch logged in employee checklist
        const res = await fetch('/api/onboarding?view=mine');
        const json = await res.json();
        if (json.success) {
          setMyOnboarding(json.data);
        }
        setActiveTab('checklist');
      }
    } catch (err) {
      console.error('Failed to fetch onboarding data:', err);
    } finally {
      setDataLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (session) {
      fetchOnboardingData();
    }
  }, [session, fetchOnboardingData]);

  const handleCompleteTask = async (taskId: string) => {
    try {
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'complete-task', taskId }),
      });
      const json = await res.json();
      if (json.success) {
        // Update local checklist state
        setMyOnboarding((prev: any) => {
          if (!prev) return prev;
          return {
            ...prev,
            completedTasks: [...prev.completedTasks, taskId],
          };
        });
      }
    } catch (err) {
      console.error('Failed to complete onboarding task:', err);
    }
  };

  if (loading || !session) {
    return (
      <AppShell>
        <div className="flex items-center justify-center py-32">
          <div
            className="w-8 h-8 rounded-full border-t-transparent"
            style={{
              animation: 'spin 0.6s linear infinite',
              borderWidth: 3,
              borderStyle: 'solid',
              borderColor: 'var(--primary)',
              borderTopColor: 'transparent',
            }}
          />
        </div>
      </AppShell>
    );
  }

  const isHR = ['HR Admin', 'Super Admin'].includes(session.role);

  return (
    <AppShell>
      <PageHeader
        title="Onboarding"
        subtitle={isHR ? "Create templates and manage checklists for new hires." : "Complete tasks to get ready for your job."}
        action={
          isHR ? (
            <Button icon={<Plus size={16} />} onClick={() => setShowCreateModal(true)} id="create-template">
              New Template
            </Button>
          ) : undefined
        }
      />

      {isHR && (
        <div className="mb-4">
          <Tabs
            tabs={[
              { id: 'active-runs', label: `Active (${activeOnboardings.length})` },
              { id: 'templates', label: `Templates (${templates.length})` },
            ]}
            activeTab={activeTab}
            onChange={(tabId) => setActiveTab(tabId as 'active-runs' | 'templates')}
          />
        </div>
      )}

      {/* Checklist View (For Employees) */}
      {!isHR && (
        <div className="space-y-6">
          {dataLoading ? (
            <div className="space-y-4" role="status" aria-label="Loading onboarding checklist">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : !myOnboarding ? (
            <div className="pc-card p-10 text-center text-[color:var(--muted-foreground)]">
              No onboarding checklist assigned to you.
            </div>
          ) : (
            <div className="space-y-4">
              {/* Progress Summary */}
              <div className="pc-card p-5">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-base">Checklist Progress</h3>
                  <span className="font-bold text-sm" style={{ color: 'var(--primary)' }}>
                    {Math.round(
                      (myOnboarding.completedTasks.length / myOnboarding.tasks.length) * 100
                    )}
                    % Complete
                  </span>
                </div>
                <div className="w-full bg-[color:var(--border)] h-2.5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${(myOnboarding.completedTasks.length / myOnboarding.tasks.length) * 100}%`,
                      backgroundColor: 'var(--primary)',
                    }}
                  />
                </div>
                <p className="text-xs text-[color:var(--muted-foreground)] mt-2">
                  {myOnboarding.completedTasks.length} of {myOnboarding.tasks.length} tasks completed
                </p>
              </div>

              {/* Tasks List */}
              <div className="space-y-3">
                {myOnboarding.tasks.map((task: any) => {
                  const completed = myOnboarding.completedTasks.includes(task.id);
                  return (
                    <div
                      key={task.id}
                      className="pc-card p-4 flex items-start gap-4 transition-all"
                      style={{ opacity: completed ? 0.7 : 1 }}
                    >
                      <button
                        onClick={() => !completed && handleCompleteTask(task.id)}
                        disabled={completed}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                          completed
                            ? 'bg-[color:var(--success)] border-[color:var(--success)] text-white'
                            : 'border-[color:var(--border)] hover:border-[color:var(--primary)] text-transparent'
                        }`}
                      >
                        ✓
                      </button>
                      <div className="flex-1">
                        <h4
                          className={`font-semibold text-sm ${completed ? 'line-through text-[color:var(--muted-foreground)]' : ''}`}
                        >
                          {task.title}
                        </h4>
                        <p className="text-xs text-[color:var(--muted-foreground)] mt-0.5">
                          {task.description}
                        </p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="primary">{task.assignedRole}</Badge>
                          <Badge variant="muted">Due +{task.dueOffsetDays}d</Badge>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Active Onboardings View (For HR Admins) */}
      {isHR && activeTab === 'active-runs' && (
        <div className="pc-card overflow-hidden">
          <DataTable
            columns={[
              {
                key: 'employee',
                header: 'New Hire',
                render: (row: any) => (
                  <span className="font-semibold text-[color:var(--foreground)]">
                    {row.employee?.fullName ?? 'Employee'}
                  </span>
                ),
              },
              {
                key: 'template',
                header: 'Template',
                render: (row: any) => row.template?.name ?? 'Onboarding Template',
              },
              {
                key: 'progress',
                header: 'Progress',
                render: (row: any) => {
                  const total = row.template?.taskIds?.length ?? 0;
                  const completed = row.completedTasks?.length ?? 0;
                  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
                  return (
                    <div className="flex items-center gap-3">
                      <div className="w-24 bg-[color:var(--border)] h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full"
                          style={{ width: `${pct}%`, backgroundColor: 'var(--primary)' }}
                        />
                      </div>
                      <span className="text-xs font-semibold">{pct}%</span>
                    </div>
                  );
                },
              },
              {
                key: 'startedAt',
                header: 'Started At',
                render: (row: any) => formatDate(row.startedAt),
              },
            ]}
            data={activeOnboardings as any}
            loading={dataLoading}
            emptyTitle="No active onboardings"
            emptyDescription="Hire an employee and assign a template to track onboarding."
          />
        </div>
      )}

      {/* Templates List View (For HR Admins) */}
      {isHR && activeTab === 'templates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dataLoading ? (
            <SkeletonCardGrid count={4} className="col-span-full md:grid-cols-2" />
          ) : templates.length === 0 ? (
            <div className="col-span-full pc-card p-10 text-center text-[color:var(--muted-foreground)]">
              No onboarding templates created yet.
            </div>
          ) : (
            templates.map((tpl) => (
              <div key={tpl.id} className="pc-card p-5 space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-base">{tpl.name}</h3>
                  <Badge variant="primary">{tpl.tasks?.length ?? 0} tasks</Badge>
                </div>
                <div className="divide-y divide-[color:var(--border)] text-xs text-[color:var(--muted-foreground)]">
                  {tpl.tasks?.map((tk: any) => (
                    <div key={tk.id} className="py-2.5 flex justify-between">
                      <span className="font-medium text-[color:var(--foreground)]">{tk.title}</span>
                      <span>Day +{tk.dueOffsetDays} ({tk.assignedRole})</span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <CreateTemplateModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={fetchOnboardingData}
      />
    </AppShell>
  );
}
