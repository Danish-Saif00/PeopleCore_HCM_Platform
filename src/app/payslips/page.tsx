'use client';
import React, { useEffect, useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { DataTable } from '@/components/tables/DataTable';
import { Badge } from '@/components/ui/Badge';
import { PayslipSidePanel } from '@/components/side-panels/PayslipSidePanel';
import { useAuth } from '@/lib/auth-context';
import { formatCurrency } from '@/lib/formatters';
import { FileText, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { Payslip } from '@/types/peoplecore';

export default function PayslipsPage() {
  const { session, loading } = useAuth();
  const router = useRouter();
  const [slips, setSlips] = useState<Payslip[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [selectedSlip, setSelectedSlip] = useState<Payslip | null>(null);

  useEffect(() => {
    if (!loading && !session) router.push('/login');
  }, [session, loading, router]);

  useEffect(() => {
    if (!session) return;
    const fetchSlips = async () => {
      setDataLoading(true);
      try {
        const res = await fetch('/api/payslips');
        const json = await res.json();
        if (json.success) {
          setSlips(json.data);
        }
      } catch (err) {
        console.error('Failed to fetch employee payslips:', err);
      } finally {
        setDataLoading(false);
      }
    };
    fetchSlips();
  }, [session]);

  const columns = [
    {
      key: 'month',
      header: 'Period',
      render: (row: Payslip) => (
        <div className="flex items-center gap-2">
          <FileText size={16} className="text-[color:var(--muted-foreground)]" />
          <span className="font-semibold text-[color:var(--foreground)]">{row.month}</span>
        </div>
      ),
    },
    {
      key: 'grossPay',
      header: 'Gross Pay',
      render: (row: Payslip) => (
        <span className="font-mono">{formatCurrency(row.grossPay)}</span>
      ),
    },
    {
      key: 'deductions',
      header: 'Deductions',
      render: (row: Payslip) => {
        const total = Object.values(row.deductions).reduce((sum, v) => sum + (v ?? 0), 0);
        return <span className="font-mono text-[color:var(--danger)]">-{formatCurrency(total)}</span>;
      },
    },
    {
      key: 'netPay',
      header: 'Net Pay',
      render: (row: Payslip) => (
        <span className="font-mono font-bold text-[color:var(--success)]">{formatCurrency(row.netPay)}</span>
      ),
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
        title="My Payslips"
        subtitle="Review your earnings, tax deductions, and download payslip PDFs."
      />

      <div className="pc-card overflow-hidden">
        <DataTable
          columns={columns as any}
          data={slips as any}
          loading={dataLoading}
          onRowClick={(row) => setSelectedSlip(row as unknown as Payslip)}
          emptyTitle="No payslips available yet"
          emptyDescription="You will see your payslips here once payroll is processed."
          emptyIcon={<FileText size={32} />}
        />
      </div>

      <PayslipSidePanel
        payslip={selectedSlip}
        employeeName={session.email.split('@')[0].split('.').map(n => n.charAt(0).toUpperCase() + n.slice(1)).join(' ')}
        open={!!selectedSlip}
        onClose={() => setSelectedSlip(null)}
      />
    </AppShell>
  );
}
