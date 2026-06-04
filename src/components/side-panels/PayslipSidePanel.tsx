'use client';
import React from 'react';
import { SidePanel } from '@/components/ui/SidePanel';
import { Button } from '@/components/ui/Button';
import { Download, FileText } from 'lucide-react';
import type { Payslip } from '@/types/peoplecore';
import { formatCurrency } from '@/lib/formatters';

interface PayslipSidePanelProps {
  payslip: Payslip | null;
  employeeName?: string;
  open: boolean;
  onClose: () => void;
}

export function PayslipSidePanel({
  payslip,
  employeeName,
  open,
  onClose,
}: PayslipSidePanelProps) {
  if (!payslip) return null;

  const handleDownload = () => {
    alert(
      `Mocked PDF download for payslip ${payslip.id}. In production, this would generate a real PDF.`
    );
  };

  const rows = [
    {
      label: 'Gross Pay',
      value: formatCurrency(payslip.grossPay),
      color: 'var(--foreground)',
    },
    {
      label: 'Income Tax',
      value: `- ${formatCurrency(payslip.deductions.tax)}`,
      color: 'var(--danger)',
    },
    {
      label: 'Health Insurance',
      value: `- ${formatCurrency(payslip.deductions.insurance)}`,
      color: 'var(--danger)',
    },
    ...(payslip.deductions.other
      ? [
          {
            label: 'Other Deductions',
            value: `- ${formatCurrency(payslip.deductions.other)}`,
            color: 'var(--danger)',
          },
        ]
      : []),
  ];

  const totalDeductions = Object.values(payslip.deductions).reduce(
    (s, v) => s + (v ?? 0),
    0
  );

  return (
    <SidePanel
      open={open}
      onClose={onClose}
      title={`Payslip — ${payslip.month}`}
      subtitle={employeeName}
      footer={
        <Button
          onClick={handleDownload}
          icon={<Download size={16} />}
          className="w-full"
          id="download-payslip"
        >
          Download PDF
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Header card */}
        <div
          className="p-5 rounded-2xl text-center"
          style={{
            background:
              'linear-gradient(135deg, var(--primary) 0%, #0f7049 100%)',
          }}
        >
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mx-auto mb-3">
            <FileText size={24} className="text-white" />
          </div>
          <p className="text-white/70 text-sm mb-1">Net Pay</p>
          <p className="text-4xl font-bold text-white">
            {formatCurrency(payslip.netPay)}
          </p>
          <p className="text-white/60 text-xs mt-1">{payslip.month}</p>
        </div>

        {/* Breakdown */}
        <div>
          <h3 className="text-sm font-semibold text-[color:var(--foreground)] mb-3">
            Pay Breakdown
          </h3>
          <div className="space-y-2">
            {rows.map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between py-2 border-b border-[color:var(--border)]"
              >
                <span className="text-sm text-[color:var(--muted-foreground)]">
                  {row.label}
                </span>
                <span
                  className="text-sm font-medium"
                  style={{ color: row.color }}
                >
                  {row.value}
                </span>
              </div>
            ))}
            <div className="flex items-center justify-between py-2 border-b border-[color:var(--border)]">
              <span className="text-sm text-[color:var(--muted-foreground)]">
                Total Deductions
              </span>
              <span
                className="text-sm font-medium"
                style={{ color: 'var(--danger)' }}
              >
                - {formatCurrency(totalDeductions)}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between pt-3">
            <span className="text-base font-semibold text-[color:var(--foreground)]">
              Net Pay
            </span>
            <span
              className="text-lg font-bold"
              style={{ color: 'var(--success)' }}
            >
              {formatCurrency(payslip.netPay)}
            </span>
          </div>
        </div>
      </div>
    </SidePanel>
  );
}
