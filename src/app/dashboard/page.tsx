'use client';
import React, { useEffect, useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { StatusBadge } from '@/components/ui/Badge';
import { PageLoader } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { SkeletonCardGrid, SkeletonStatGrid } from '@/components/ui/skeleton';
import { useAuth } from '@/lib/auth-context';
import { formatCurrency, formatDate, formatRelativeTime } from '@/lib/formatters';
import {
  Users, DollarSign, Calendar, CheckSquare, Clock,
  TrendingUp, AlertCircle, FileText, Star, Clipboard
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface DashboardData {
  employees?: unknown[];
  payrollRuns?: unknown[];
  timeOffRequests?: unknown[];
  notifications?: unknown[];
  onboarding?: unknown;
  reviews?: unknown[];
}

export default function DashboardPage() {
  const { session, loading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<DashboardData>({});
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && !session) { router.push('/login'); return; }
  }, [session, loading, router]);

  useEffect(() => {
    if (!session) return;
    const fetchAll = async () => {
      setDataLoading(true);
      const fetches: Promise<void>[] = [];
      const result: DashboardData = {};

      if (['HR Admin', 'Super Admin'].includes(session.role)) {
        fetches.push(
          fetch('/api/employees').then((r) => r.json()).then((d) => { if (d.success) result.employees = d.data; }),
          fetch('/api/payroll').then((r) => r.json()).then((d) => { if (d.success) result.payrollRuns = d.data; }),
          fetch('/api/time-off?view=all').then((r) => r.json()).then((d) => { if (d.success) result.timeOffRequests = d.data; }),
        );
      } else if (session.role === 'Manager') {
        fetches.push(
          fetch('/api/time-off?view=manager').then((r) => r.json()).then((d) => { if (d.success) result.timeOffRequests = d.data; }),
          fetch('/api/reviews?view=reviewer').then((r) => r.json()).then((d) => { if (d.success) result.reviews = d.data; }),
        );
      } else {
        fetches.push(
          fetch('/api/time-off?view=mine').then((r) => r.json()).then((d) => { if (d.success) result.timeOffRequests = d.data; }),
          fetch('/api/onboarding').then((r) => r.json()).then((d) => { if (d.success) result.onboarding = d.data; }),
          fetch('/api/reviews?view=mine').then((r) => r.json()).then((d) => { if (d.success) result.reviews = d.data; }),
        );
      }

      fetches.push(
        fetch('/api/notifications').then((r) => r.json()).then((d) => { if (d.success) result.notifications = d.data; })
      );

      await Promise.all(fetches);
      setData(result);
      setDataLoading(false);
    };
    fetchAll();
  }, [session]);

  if (loading || !session) return <PageLoader />;

  const role = session.role;
  const timeOffRequests = (data.timeOffRequests as Array<{ status: string; type: string; startDate: string; endDate: string }> | undefined) ?? [];
  const notifications = (data.notifications as Array<{ id: string; title: string; message: string; read: boolean; createdAt: string; type: string }> | undefined) ?? [];
  const employees = (data.employees as Array<{ status: string }> | undefined) ?? [];
  const payrollRuns = (data.payrollRuns as Array<{ status: string; period: string; totalAmount: number }> | undefined) ?? [];
  const reviews = (data.reviews as Array<{ status: string; employee?: { fullName: string }; period: string }> | undefined) ?? [];
  const onboarding = data.onboarding as { completedTasks: string[]; template: { taskIds: string[] }; tasks: Array<{ id: string; title: string; assignedRole: string; dueOffsetDays: number }> } | null | undefined;

  const firstName = session.email.split('@')[0].split('.')[0];
  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const pendingTimeOff = timeOffRequests.filter((r) => r.status === 'Pending').length;
  const approvedTimeOff = timeOffRequests.filter((r) => r.status === 'Approved').length;
  const unreadNotifs = notifications.filter((n) => !n.read).length;
  const pendingReviews = reviews.filter((r) => r.status === 'Pending').length;

  const onboardingProgress = onboarding && onboarding.template
    ? Math.round((onboarding.completedTasks.length / onboarding.template.taskIds.length) * 100)
    : null;

  return (
    <AppShell>
      <PageHeader
        title={`${greeting()}, ${firstName.charAt(0).toUpperCase() + firstName.slice(1)} \u{1F44B}`}
        subtitle={`${role} Dashboard \u2014 ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`}
      />

      {dataLoading ? (
        <div className="space-y-6" role="status" aria-label="Loading dashboard">
          <SkeletonStatGrid />
          <SkeletonCardGrid count={3} className="lg:grid-cols-3" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Super Admin / HR Admin stats */}
          {['HR Admin', 'Super Admin'].includes(role) && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Total Employees"
                value={employees.length}
                subtitle={`${employees.filter((e) => e.status === 'Active').length} active`}
                icon={<Users size={20} />}
              />
              <StatCard
                title="Monthly Payroll"
                value={formatCurrency(payrollRuns.find((p) => p.status === 'Completed')?.totalAmount ?? 0)}
                subtitle="Last completed run"
                icon={<DollarSign size={20} />}
                iconColor="var(--chart-3)"
              />
              <StatCard
                title="Pending Time Off"
                value={pendingTimeOff}
                subtitle="Awaiting approval"
                icon={<Calendar size={20} />}
                iconColor="var(--chart-3)"
              />
              <StatCard
                title="Notifications"
                value={unreadNotifs}
                subtitle="Unread"
                icon={<AlertCircle size={20} />}
                iconColor="var(--danger)"
              />
            </div>
          )}

          {/* Manager stats */}
          {role === 'Manager' && (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              <StatCard
                title="Pending Approvals"
                value={pendingTimeOff}
                subtitle="Time-off requests"
                icon={<Clock size={20} />}
                iconColor="var(--chart-3)"
              />
              <StatCard
                title="Pending Reviews"
                value={pendingReviews}
                subtitle="To complete"
                icon={<Star size={20} />}
                iconColor="var(--chart-4)"
              />
              <StatCard
                title="Notifications"
                value={unreadNotifs}
                subtitle="Unread"
                icon={<AlertCircle size={20} />}
                iconColor="var(--danger)"
              />
            </div>
          )}

          {/* Employee stats */}
          {role === 'Employee' && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Days Off Remaining"
                value={18 - approvedTimeOff}
                subtitle="Annual leave"
                icon={<Calendar size={20} />}
              />
              <StatCard
                title="Next Payday"
                value="Mar 31"
                subtitle="Approx. 27 days"
                icon={<DollarSign size={20} />}
                iconColor="var(--chart-3)"
              />
              <StatCard
                title="Onboarding"
                value={onboardingProgress !== null ? `${onboardingProgress}%` : 'N/A'}
                subtitle="Completion"
                icon={<Clipboard size={20} />}
                iconColor="var(--chart-2)"
              />
              <StatCard
                title="Notifications"
                value={unreadNotifs}
                subtitle="Unread"
                icon={<AlertCircle size={20} />}
                iconColor="var(--danger)"
              />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent activity */}
            <div className="lg:col-span-2 pc-card">
              <div className="p-5 border-b border-[color:var(--border)] flex items-center justify-between">
                <h2 className="card-title">Recent Activity</h2>
                <span className="text-xs text-[color:var(--muted-foreground)]">{notifications.length} events</span>
              </div>
              <div className="divide-y divide-[color:var(--border)]">
                {notifications.slice(0, 6).length === 0 ? (
                  <EmptyState title="No activity yet" description="Actions will appear here." />
                ) : (
                  notifications.slice(0, 6).map((n) => {
                    const typeConfig: Record<string, { bg: string; color: string; icon: React.ReactNode }> = {
                      Payroll: { bg: 'var(--warning-soft)', color: 'var(--warning)', icon: <DollarSign size={14} /> },
                      'Time Off': { bg: 'var(--primary-soft)', color: 'var(--primary)', icon: <Calendar size={14} /> },
                      Reviews: { bg: 'rgba(155,81,224,0.12)', color: 'var(--chart-4)', icon: <Star size={14} /> },
                      Onboarding: { bg: 'var(--success-soft)', color: 'var(--success)', icon: <CheckSquare size={14} /> },
                    };
                    const cfg = typeConfig[n.type] ?? { bg: 'var(--muted)', color: 'var(--muted-foreground)', icon: <AlertCircle size={14} /> };
                    return (
                      <div
                        key={n.id}
                        className="flex items-start gap-3 p-4 hover:bg-[color:var(--muted)]/50 transition-colors"
                      >
                        <span
                          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                          style={{ background: cfg.bg, color: cfg.color }}
                        >
                          {cfg.icon}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-medium text-[color:var(--foreground)]">{n.title}</p>
                            {!n.read && (
                              <span className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5" style={{ background: 'var(--primary)' }} />
                            )}
                          </div>
                          <p className="text-xs text-[color:var(--muted-foreground)] mt-0.5">{n.message}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs" style={{ color: cfg.color }}>{n.type}</span>
                            <span className="text-xs text-[color:var(--muted-foreground)]">· {formatRelativeTime(n.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-4">
              {/* Onboarding checklist for employees */}
              {role === 'Employee' && onboarding && onboarding.tasks && (
                <div className="pc-card">
                  <div className="p-4 border-b border-[color:var(--border)]">
                    <h2 className="card-title text-sm">Onboarding Checklist</h2>
                    <div className="mt-2">
                      <div className="pc-progress">
                        <div className="pc-progress-bar" style={{ width: `${onboardingProgress}%` }} />
                      </div>
                      <p className="text-xs text-[color:var(--muted-foreground)] mt-1">
                        {onboarding.completedTasks.length} of {onboarding.template?.taskIds?.length ?? 0} tasks completed
                      </p>
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    {onboarding.tasks.slice(0, 4).map((task) => {
                      const done = onboarding.completedTasks.includes(task.id);
                      return (
                        <div key={task.id} className="flex items-start gap-3">
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold ${done ? 'text-white' : 'border-2 border-[color:var(--border)]'}`}
                            style={{ background: done ? 'var(--success)' : undefined }}
                          >
                            {done && '\u2713'}
                          </span>
                          <div>
                            <p className={`text-sm ${done ? 'line-through text-[color:var(--muted-foreground)]' : 'font-medium'}`}>
                              {task.title}
                            </p>
                            <p className="text-xs text-[color:var(--muted-foreground)]">{task.assignedRole}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="px-4 pb-4">
                    <Link href="/onboarding" className="text-xs font-medium" style={{ color: 'var(--primary)' }}>
                      View full checklist &rarr;
                    </Link>
                  </div>
                </div>
              )}

              {/* Quick links */}
              <div className="pc-card p-4">
                <h2 className="card-title text-sm mb-3">Quick Actions</h2>
                <div className="space-y-2">
                  {role === 'Employee' && (
                    <>
                      <Link
                        href="/time-off"
                        className="flex items-center gap-2 p-2.5 rounded-lg hover:bg-[color:var(--muted)] transition-colors text-sm"
                      >
                        <Calendar size={14} style={{ color: 'var(--primary)' }} />
                        Request time off
                      </Link>
                      <Link
                        href="/payslips"
                        className="flex items-center gap-2 p-2.5 rounded-lg hover:bg-[color:var(--muted)] transition-colors text-sm"
                      >
                        <FileText size={14} style={{ color: 'var(--primary)' }} />
                        View payslips
                      </Link>
                    </>
                  )}
                  {role === 'Manager' && (
                    <>
                      <Link
                        href="/time-off"
                        className="flex items-center gap-2 p-2.5 rounded-lg hover:bg-[color:var(--muted)] transition-colors text-sm"
                      >
                        <Clock size={14} style={{ color: 'var(--warning)' }} />
                        Review time-off requests ({pendingTimeOff})
                      </Link>
                      <Link
                        href="/reviews"
                        className="flex items-center gap-2 p-2.5 rounded-lg hover:bg-[color:var(--muted)] transition-colors text-sm"
                      >
                        <Star size={14} style={{ color: 'var(--chart-4)' }} />
                        Complete reviews ({pendingReviews})
                      </Link>
                    </>
                  )}
                  {['HR Admin', 'Super Admin'].includes(role) && (
                    <>
                      <Link
                        href="/employees"
                        className="flex items-center gap-2 p-2.5 rounded-lg hover:bg-[color:var(--muted)] transition-colors text-sm"
                      >
                        <Users size={14} style={{ color: 'var(--primary)' }} />
                        Manage employees
                      </Link>
                      <Link
                        href="/payroll"
                        className="flex items-center gap-2 p-2.5 rounded-lg hover:bg-[color:var(--muted)] transition-colors text-sm"
                      >
                        <DollarSign size={14} style={{ color: 'var(--chart-3)' }} />
                        Run payroll
                      </Link>
                      <Link
                        href="/onboarding"
                        className="flex items-center gap-2 p-2.5 rounded-lg hover:bg-[color:var(--muted)] transition-colors text-sm"
                      >
                        <Clipboard size={14} style={{ color: 'var(--chart-2)' }} />
                        Manage onboarding
                      </Link>
                    </>
                  )}
                  <Link
                    href="/org-chart"
                    className="flex items-center gap-2 p-2.5 rounded-lg hover:bg-[color:var(--muted)] transition-colors text-sm"
                  >
                    <TrendingUp size={14} style={{ color: 'var(--chart-2)' }} />
                    View org chart
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Time-off requests preview */}
          {timeOffRequests.length > 0 && (
            <div className="pc-card">
              <div className="p-5 border-b border-[color:var(--border)] flex items-center justify-between">
                <h2 className="card-title">Recent Time-Off Requests</h2>
                <Link href="/time-off" className="text-xs font-medium" style={{ color: 'var(--primary)' }}>
                  View all &rarr;
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="pc-table">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Period</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {timeOffRequests.slice(0, 5).map((req, i) => (
                      <tr key={i}>
                        <td className="font-medium">{req.type}</td>
                        <td>
                          {formatDate(req.startDate)} &mdash; {formatDate(req.endDate)}
                        </td>
                        <td>
                          <StatusBadge status={req.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </AppShell>
  );
}
