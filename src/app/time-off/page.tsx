'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { DataTable } from '@/components/tables/DataTable';
import { StatusBadge, Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';
import { RequestTimeOffModal } from '@/components/modals/RequestTimeOffModal';
import { TimeOffRequestSidePanel } from '@/components/side-panels/TimeOffRequestSidePanel';
import { TimeOffCalendar } from '@/components/cards/TimeOffCalendar';
import { useAuth } from '@/lib/auth-context';
import { formatDate, countWorkingDays } from '@/lib/formatters';
import { Plus, Calendar, Clock, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { Employee, TimeOffRequest } from '@/types/peoplecore';

const TYPE_FILTER_OPTIONS = [
  { value: 'all', label: 'All Types' },
  { value: 'Annual Leave', label: 'Annual Leave' },
  { value: 'Sick Leave', label: 'Sick Leave' },
  { value: 'Unpaid', label: 'Unpaid' },
];

const STATUS_FILTER_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'Pending', label: 'Pending' },
  { value: 'Approved', label: 'Approved' },
  { value: 'Rejected', label: 'Rejected' },
];

export default function TimeOffPage() {
  const { session, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'mine' | 'team'>('mine');
  const [requests, setRequests] = useState<TimeOffRequest[]>([]);
  const [calendarRequests, setCalendarRequests] = useState<TimeOffRequest[]>([]);
  const [calendarEmployees, setCalendarEmployees] = useState<Employee[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [calendarLoading, setCalendarLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<TimeOffRequest | null>(null);

  useEffect(() => {
    if (!loading && !session) router.push('/login');
  }, [session, loading, router]);

  const fetchRequests = useCallback(async () => {
    setDataLoading(true);
    const view = activeTab === 'mine' ? 'mine' : 'manager';
    const params = new URLSearchParams({ view });
    if (typeFilter !== 'all') params.set('type', typeFilter);
    if (statusFilter !== 'all') params.set('status', statusFilter);
    try {
      const res = await fetch(`/api/time-off?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setRequests(json.data);
      }
    } catch (err) {
      console.error('Failed to fetch time-off requests:', err);
    } finally {
      setDataLoading(false);
    }
  }, [activeTab, typeFilter, statusFilter]);

  useEffect(() => {
    if (session) {
      fetchRequests();
    }
  }, [session, fetchRequests]);

  const fetchCalendarData = useCallback(async () => {
    setCalendarLoading(true);
    try {
      const [requestsResponse, employeesResponse] = await Promise.all([
        fetch('/api/time-off?view=all&status=Approved'),
        fetch('/api/employees'),
      ]);
      const [requestsJson, employeesJson] = await Promise.all([
        requestsResponse.json(),
        employeesResponse.json(),
      ]);
      if (requestsJson.success) setCalendarRequests(requestsJson.data);
      if (employeesJson.success) setCalendarEmployees(employeesJson.data);
    } catch (err) {
      console.error('Failed to fetch time-off calendar data:', err);
    } finally {
      setCalendarLoading(false);
    }
  }, []);

  useEffect(() => {
    if (session) fetchCalendarData();
  }, [session, fetchCalendarData]);

  const refreshTimeOffData = useCallback(async () => {
    await Promise.all([fetchRequests(), fetchCalendarData()]);
  }, [fetchRequests, fetchCalendarData]);

  const columns = [
    {
      key: 'type',
      header: 'Type',
      render: (row: TimeOffRequest) => (
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-[color:var(--muted-foreground)]" />
          <span className="font-semibold text-[color:var(--foreground)]">{row.type}</span>
        </div>
      ),
    },
    {
      key: 'period',
      header: 'Period',
      render: (row: TimeOffRequest) => (
        <span>
          {formatDate(row.startDate)} - {formatDate(row.endDate)}
        </span>
      ),
    },
    {
      key: 'days',
      header: 'Working Days',
      render: (row: TimeOffRequest) => {
        const days = countWorkingDays(row.startDate, row.endDate);
        return `${days} day${days !== 1 ? 's' : ''}`;
      },
    },
    {
      key: 'status',
      header: 'Status',
      render: (row: TimeOffRequest) => <StatusBadge status={row.status} />,
    },
    {
      key: 'createdAt',
      header: 'Requested On',
      render: (row: TimeOffRequest) => formatDate(row.createdAt),
    },
    {
      key: 'actions',
      header: '',
      render: () => <ChevronRight size={16} className="text-[color:var(--muted-foreground)] ml-auto" />,
    },
  ];

  if (loading || !session) {
    return (
      <AppShell>
        <div className="flex items-center justify-center py-32">
          <div
            className="w-8 h-8 rounded-full border-t-transparent"
            style={{
              animation: 'spin var(--motion-loading-spin) linear infinite',
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

  const isManagerOrAdmin = ['Manager', 'HR Admin', 'Super Admin'].includes(session.role);

  return (
    <AppShell>
      <PageHeader
        title="Time Off"
        subtitle="Manage personal leave requests or approve requests from your team."
        action={
          <Button icon={<Plus size={16} />} onClick={() => setShowRequestModal(true)} id="request-time-off">
            Request Leave
          </Button>
        }
      />

      {isManagerOrAdmin && (
        <div className="mb-4">
          <Tabs
            tabs={[
              { id: 'mine', label: 'My Requests' },
              { id: 'team', label: 'Team Approvals' },
            ]}
            activeTab={activeTab}
            onChange={(tabId) => {
              setActiveTab(tabId as 'mine' | 'team');
              setRequests([]);
            }}
          />
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <select
          className="pc-select h-9 text-sm w-auto min-w-[140px]"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          id="filter-timeoff-type"
        >
          {TYPE_FILTER_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <select
          className="pc-select h-9 text-sm w-auto min-w-[140px]"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          id="filter-timeoff-status"
        >
          {STATUS_FILTER_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="pc-card overflow-hidden">
        <DataTable
          columns={columns as any}
          data={requests as any}
          loading={dataLoading}
          onRowClick={(row) => setSelectedRequest(row as unknown as TimeOffRequest)}
          emptyTitle="No time-off requests found"
          emptyDescription="You will see leave requests listed here."
          emptyIcon={<Clock size={32} />}
        />
      </div>

      <div className="mt-6">
        <TimeOffCalendar
          requests={calendarRequests}
          employees={calendarEmployees}
          loading={calendarLoading}
        />
      </div>

      {/* Request leave modal */}
      <RequestTimeOffModal
        open={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        onSuccess={refreshTimeOffData}
      />

      {/* Detail panel */}
      <TimeOffRequestSidePanel
        request={selectedRequest}
        employeeName={selectedRequest ? `Request #${selectedRequest.id}` : ''}
        open={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        canApprove={activeTab === 'team' && isManagerOrAdmin}
        onApprove={refreshTimeOffData}
        onReject={refreshTimeOffData}
      />
    </AppShell>
  );
}
