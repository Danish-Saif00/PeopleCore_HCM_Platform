'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { DataTable } from '@/components/tables/DataTable';
import { Avatar } from '@/components/ui/Avatar';
import { StatusBadge, Badge } from '@/components/ui/Badge';
import { Tabs } from '@/components/ui/Tabs';
import { TimeOffRequestSidePanel } from '@/components/side-panels/TimeOffRequestSidePanel';
import { useAuth } from '@/lib/auth-context';
import { formatDate } from '@/lib/formatters';
import { Users, Clock, Mail, Phone, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { Employee, TimeOffRequest } from '@/types/peoplecore';

export default function TeamPage() {
  const { session, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'roster' | 'pending-leaves'>('roster');
  const [teamMembers, setTeamMembers] = useState<Employee[]>([]);
  const [leaves, setLeaves] = useState<TimeOffRequest[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<TimeOffRequest | null>(null);

  useEffect(() => {
    if (!loading && !session) router.push('/login');
    if (!loading && session && !['Manager', 'HR Admin', 'Super Admin'].includes(session.role)) {
      router.push('/restricted');
    }
  }, [session, loading, router]);

  const fetchTeamData = useCallback(async () => {
    if (!session) return;
    setDataLoading(true);
    try {
      // Fetch roster (filter employees by managerId in client-side or use api)
      const empRes = await fetch('/api/employees');
      const empJson = await empRes.json();
      if (empJson.success) {
        const roster = empJson.data.filter((e: Employee) => e.managerId === session.employeeId);
        setTeamMembers(roster);
      }

      // Fetch team leave requests
      const leaveRes = await fetch('/api/time-off?view=manager');
      const leaveJson = await leaveRes.json();
      if (leaveJson.success) {
        setLeaves(leaveJson.data);
      }
    } catch (err) {
      console.error('Failed to fetch team data:', err);
    } finally {
      setDataLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (session) {
      fetchTeamData();
    }
  }, [session, fetchTeamData]);

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

  const pendingLeaves = leaves.filter((l) => l.status === 'Pending');

  return (
    <AppShell>
      <PageHeader
        title="My Team"
        subtitle={`Manage details, status, and pending approvals for your direct reports.`}
      />

      <div className="mb-4">
        <Tabs
          tabs={[
            { id: 'roster', label: `Roster (${teamMembers.length})` },
            { id: 'pending-leaves', label: `Pending Leaves (${pendingLeaves.length})` },
          ]}
          activeTab={activeTab}
          onChange={(tabId) => setActiveTab(tabId as 'roster' | 'pending-leaves')}
        />
      </div>

      {activeTab === 'roster' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dataLoading ? (
            <div className="col-span-full flex justify-center py-10">
              <div
                className="w-6 h-6 rounded-full border-t-transparent"
                style={{
                  animation: 'spin 0.6s linear infinite',
                  borderWidth: 2,
                  borderStyle: 'solid',
                  borderColor: 'var(--primary)',
                  borderTopColor: 'transparent',
                }}
              />
            </div>
          ) : teamMembers.length === 0 ? (
            <div className="col-span-full pc-card p-8 text-center text-[color:var(--muted-foreground)]">
              No direct reports found under your management.
            </div>
          ) : (
            teamMembers.map((emp) => (
              <div key={emp.id} className="pc-card p-5 space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar name={emp.fullName} size="md" />
                  <div>
                    <h3 className="font-semibold text-base">{emp.fullName}</h3>
                    <p className="text-xs text-[color:var(--muted-foreground)]">{emp.jobTitle}</p>
                  </div>
                </div>
                <div className="space-y-1.5 pt-2 border-t border-[color:var(--border)] text-xs text-[color:var(--muted-foreground)]">
                  <div className="flex items-center gap-2">
                    <Mail size={12} />
                    <span>{emp.email}</span>
                  </div>
                  {emp.phone && (
                    <div className="flex items-center gap-2">
                      <Phone size={12} />
                      <span>{emp.phone}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-2">
                    <Badge variant="primary">{emp.employmentType}</Badge>
                    <StatusBadge status={emp.status} />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'pending-leaves' && (
        <div className="pc-card overflow-hidden">
          <DataTable
            columns={[
              {
                key: 'employeeId',
                header: 'Team Member',
                render: (row: any) => {
                  const emp = teamMembers.find((e) => e.id === row.employeeId);
                  return (
                    <div className="flex items-center gap-2">
                      <Avatar name={emp?.fullName ?? 'Employee'} size="sm" />
                      <span className="font-medium">{emp?.fullName ?? 'Employee'}</span>
                    </div>
                  );
                },
              },
              {
                key: 'type',
                header: 'Type',
              },
              {
                key: 'period',
                header: 'Period',
                render: (row: any) => (
                  <span>
                    {formatDate(row.startDate)} - {formatDate(row.endDate)}
                  </span>
                ),
              },
              {
                key: 'status',
                header: 'Status',
                render: (row: any) => <StatusBadge status={row.status} />,
              },
              {
                key: 'action',
                header: '',
                render: () => <ChevronRight size={16} className="ml-auto text-[color:var(--muted-foreground)]" />,
              },
            ]}
            data={pendingLeaves as any}
            loading={dataLoading}
            onRowClick={(row) => setSelectedRequest(row as unknown as TimeOffRequest)}
            emptyTitle="All caught up!"
            emptyDescription="No pending time-off requests to review."
            emptyIcon={<Clock size={32} />}
          />
        </div>
      )}

      {/* Approve/Reject Leave panel */}
      <TimeOffRequestSidePanel
        request={selectedRequest}
        employeeName={
          selectedRequest
            ? teamMembers.find((e) => e.id === selectedRequest.employeeId)?.fullName
            : ''
        }
        open={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        canApprove={true}
        onApprove={fetchTeamData}
        onReject={fetchTeamData}
      />
    </AppShell>
  );
}
