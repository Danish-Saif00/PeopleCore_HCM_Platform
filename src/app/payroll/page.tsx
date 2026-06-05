'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { DataTable } from '@/components/tables/DataTable';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { RunPayrollModal } from '@/components/modals/RunPayrollModal';
import { SidePanel } from '@/components/ui/SidePanel';
import { useAuth } from '@/lib/auth-context';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { DollarSign, Users, Play, FileText, Download } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { SkeletonCard } from '@/components/ui/skeleton';
import type { PayrollRun, Payslip } from '@/types/peoplecore';

const STATUSES = ['All', 'Completed', 'Pending', 'Processing', 'Failed'];

export default function PayrollPage() {
  const { session, loading } = useAuth();
  const router = useRouter();
  const [runs, setRuns] = useState<PayrollRun[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [showRunModal, setShowRunModal] = useState(false);
  const [meta, setMeta] = useState({ estimatedGross: 0, employeeCount: 0 });
  const [selectedRun, setSelectedRun] = useState<PayrollRun | null>(null);
  const [payslips, setPayslips] = useState<Payslip[]>([]);
  const [slipsLoading, setSlipsLoading] = useState(false);
  const [selectedPayslip, setSelectedPayslip] = useState<Payslip | null>(null);

  useEffect(() => {
    if (!loading && !session) router.push('/login');
    if (!loading && session && !['HR Admin', 'Super Admin'].includes(session.role)) {
      router.push('/restricted');
    }
  }, [session, loading, router]);

  const fetchData = useCallback(async () => {
    setDataLoading(true);
    try {
      const res = await fetch('/api/payroll');
      const json = await res.json();
      if (json.success) {
        setRuns(json.data);
        setMeta(json.meta);
      }
    } catch (err) {
      console.error('Failed to fetch payroll runs:', err);
    } finally {
      setDataLoading(false);
    }
  }, []);

  useEffect(() => {
    if (session) {
      fetchData();
    }
  }, [session, fetchData]);

  const handleFetchPayslips = async (run: PayrollRun) => {
    setSelectedRun(run);
    setSlipsLoading(true);
    try {
      const res = await fetch(`/api/payslips?runId=${run.id}`);
      const json = await res.json();
      if (json.success) {
        setPayslips(json.data);
      }
    } catch (err) {
      console.error('Failed to fetch run payslips:', err);
    } finally {
      setSlipsLoading(false);
    }
  };

  const filteredRuns = runs.filter(
    (r) => statusFilter === 'All' || r.status.toLowerCase() === statusFilter.toLowerCase()
  );

  const columns = [
    {
      key: 'period',
      header: 'Pay Period',
      render: (row: PayrollRun) => (
        <div>
          <p className="font-semibold text-[color:var(--foreground)]">{row.period}</p>
          {row.dateFrom && row.dateTo && (
            <p className="text-xs text-[color:var(--muted-foreground)]">
              {formatDate(row.dateFrom)} - {formatDate(row.dateTo)}
            </p>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row: PayrollRun) => <StatusBadge status={row.status} />,
    },
    {
      key: 'employeeCount',
      header: 'Employees',
      render: (row: PayrollRun) => row.employeeCount ?? meta.employeeCount,
    },
    {
      key: 'totalAmount',
      header: 'Total Run Cost',
      render: (row: PayrollRun) => (
        <span className="font-mono font-medium">
          {row.totalAmount > 0 ? formatCurrency(row.totalAmount) : '—'}
        </span>
      ),
    },
    {
      key: 'runAt',
      header: 'Processed At',
      render: (row: PayrollRun) => (row.runAt ? formatDate(row.runAt) : '—'),
    },
  ];

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

  return (
    <AppShell>
      <PageHeader
        title="Payroll Run History"
        subtitle="Manage salary payouts and process monthly payroll runs."
        action={
          <Button icon={<Play size={16} />} onClick={() => setShowRunModal(true)} id="run-payroll">
            Run Payroll
          </Button>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="pc-stat-card flex items-center justify-between">
          <div>
            <p className="text-xs text-[color:var(--muted-foreground)] uppercase tracking-wider font-semibold">
              Estimated Monthly Cost
            </p>
            <h3 className="text-2xl font-bold mt-1" style={{ color: 'var(--primary)' }}>
              {formatCurrency(meta.estimatedGross)}
            </h3>
            <p className="text-xs text-[color:var(--muted-foreground)] mt-0.5">
              Based on active contracts
            </p>
          </div>
          <div className="p-3 rounded-xl bg-[color:var(--primary-soft)]">
            <DollarSign size={24} style={{ color: 'var(--primary)' }} />
          </div>
        </div>

        <div className="pc-stat-card flex items-center justify-between">
          <div>
            <p className="text-xs text-[color:var(--muted-foreground)] uppercase tracking-wider font-semibold">
              Active Headcount
            </p>
            <h3 className="text-2xl font-bold mt-1" style={{ color: 'var(--success)' }}>
              {meta.employeeCount} employees
            </h3>
            <p className="text-xs text-[color:var(--muted-foreground)] mt-0.5">
              Eligible for current period
            </p>
          </div>
          <div className="p-3 rounded-xl bg-[color:var(--success-soft)]">
            <Users size={24} style={{ color: 'var(--success)' }} />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-5">
        <select
          className="pc-select h-9 text-sm w-auto min-w-[150px]"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          id="filter-payroll-status"
        >
          {STATUSES.map((s) => (
            <option key={s}>{s} Runs</option>
          ))}
        </select>
      </div>

      <div className="pc-card overflow-hidden">
        <DataTable
          columns={columns as any}
          data={filteredRuns as any}
          loading={dataLoading}
          onRowClick={(row) => handleFetchPayslips(row as unknown as PayrollRun)}
          emptyTitle="No payroll runs found"
          emptyDescription="Start by processing a payroll period."
        />
      </div>

      {/* Process Payroll Modal */}
      <RunPayrollModal
        open={showRunModal}
        onClose={() => setShowRunModal(false)}
        onSuccess={fetchData}
        estimatedGross={meta.estimatedGross}
        employeeCount={meta.employeeCount}
      />

      {/* Payslips Side Panel for Selected Run */}
      {selectedRun && (
        <SidePanel
          open={!!selectedRun}
          onClose={() => {
            setSelectedRun(null);
            setPayslips([]);
          }}
          title={`Payroll Period: ${selectedRun.period}`}
          subtitle={`Status: ${selectedRun.status}`}
        >
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Generated Payslips</h3>
            {slipsLoading ? (
              <div className="space-y-2" role="status" aria-label="Loading generated payslips">
                <SkeletonCard className="p-3" />
                <SkeletonCard className="p-3" />
                <SkeletonCard className="p-3" />
              </div>
            ) : payslips.length === 0 ? (
              <p className="text-sm text-[color:var(--muted-foreground)]">
                No payslips found for this run.
              </p>
            ) : (
              <div className="space-y-2">
                {payslips.map((slip: any) => (
                  <div
                    key={slip.id}
                    className="flex justify-between items-center p-3 border border-[color:var(--border)] rounded-xl cursor-pointer hover:bg-[color:var(--muted)] transition-colors"
                    onClick={() => setSelectedPayslip(slip)}
                  >
                    <div>
                      <p className="text-sm font-semibold">
                        {slip.employee?.fullName ?? 'Employee'}
                      </p>
                      <p className="text-xs text-[color:var(--muted-foreground)]">
                        {slip.employee?.jobTitle ?? 'Job Title'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-mono font-semibold text-[color:var(--success)]">
                        {formatCurrency(slip.netPay)}
                      </p>
                      <p className="text-xs text-[color:var(--muted-foreground)]">Net Pay</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </SidePanel>
      )}

      {/* Individual Payslip Side Panel */}
      {selectedPayslip && (
        <SidePanel
          open={!!selectedPayslip}
          onClose={() => setSelectedPayslip(null)}
          title={`Payslip — ${selectedPayslip.month}`}
          subtitle={(selectedPayslip as any).employee?.fullName}
          footer={
            <Button
              onClick={() =>
                alert(
                  `Mocked PDF download for payslip ${selectedPayslip.id}. In production, this would generate a real PDF.`
                )
              }
              icon={<Download size={16} />}
              className="w-full"
            >
              Download PDF
            </Button>
          }
        >
          <div className="space-y-6">
            <div
              className="p-5 rounded-2xl text-center"
              style={{
                background: 'linear-gradient(135deg, var(--primary) 0%, #0f7049 100%)',
              }}
            >
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mx-auto mb-3">
                <FileText size={24} className="text-white" />
              </div>
              <p className="text-white/70 text-sm mb-1">Net Pay</p>
              <p className="text-4xl font-bold text-white">
                {formatCurrency(selectedPayslip.netPay)}
              </p>
              <p className="text-white/60 text-xs mt-1">{selectedPayslip.month}</p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-[color:var(--foreground)] mb-3">
                Pay Breakdown
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between py-2 border-b border-[color:var(--border)]">
                  <span className="text-sm text-[color:var(--muted-foreground)]">Gross Pay</span>
                  <span className="text-sm font-medium">{formatCurrency(selectedPayslip.grossPay)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[color:var(--border)]">
                  <span className="text-sm text-[color:var(--muted-foreground)]">Income Tax</span>
                  <span className="text-sm font-medium text-[color:var(--danger)]">
                    -{formatCurrency(selectedPayslip.deductions.tax)}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-[color:var(--border)]">
                  <span className="text-sm text-[color:var(--muted-foreground)]">Health Insurance</span>
                  <span className="text-sm font-medium text-[color:var(--danger)]">
                    -{formatCurrency(selectedPayslip.deductions.insurance)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </SidePanel>
      )}
    </AppShell>
  );
}
