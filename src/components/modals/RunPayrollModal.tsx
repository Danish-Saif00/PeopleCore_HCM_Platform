'use client';
import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { DateRangePicker } from '@/components/ui/DateRangePicker';
import { formatCurrency } from '@/lib/formatters';
import { DollarSign, Users, AlertCircle } from 'lucide-react';

interface RunPayrollModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  estimatedGross: number;
  employeeCount: number;
}

export function RunPayrollModal({
  open,
  onClose,
  onSuccess,
  estimatedGross,
  employeeCount,
}: RunPayrollModalProps) {
  const [period, setPeriod] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!period.trim()) e.period = 'Pay period is required.';
    if (!dateFrom) e.dateFrom = 'Start date is required.';
    if (!dateTo) e.dateTo = 'End date is required.';
    if (dateFrom && dateTo && dateFrom > dateTo)
      e.dateTo = 'End date must be after start date.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/payroll/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ period, dateFrom, dateTo }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error ?? 'Payroll run failed.');
      } else {
        setPeriod('');
        setDateFrom('');
        setDateTo('');
        setErrors({});
        onSuccess();
        onClose();
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Run Payroll"
      subtitle="Process payroll for all active employees"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            loading={loading}
            id="confirm-run-payroll"
          >
            Process Payroll
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {/* Summary */}
        <div className="grid grid-cols-2 gap-3">
          <div
            className="p-3 rounded-xl"
            style={{ background: 'var(--primary-soft)' }}
          >
            <div className="flex items-center gap-2 mb-1">
              <Users size={14} style={{ color: 'var(--primary)' }} />
              <span className="text-xs text-[color:var(--muted-foreground)]">
                Employees
              </span>
            </div>
            <p
              className="text-xl font-bold"
              style={{ color: 'var(--primary)' }}
            >
              {employeeCount}
            </p>
          </div>
          <div
            className="p-3 rounded-xl"
            style={{ background: 'var(--success-soft)' }}
          >
            <div className="flex items-center gap-2 mb-1">
              <DollarSign size={14} style={{ color: 'var(--success)' }} />
              <span className="text-xs text-[color:var(--muted-foreground)]">
                Est. Gross
              </span>
            </div>
            <p
              className="text-xl font-bold"
              style={{ color: 'var(--success)' }}
            >
              {formatCurrency(estimatedGross)}
            </p>
          </div>
        </div>

        <Input
          id="payroll-period"
          label="Pay Period"
          placeholder="e.g. Mar 2025"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          error={errors.period}
        />

        <DateRangePicker
          fromValue={dateFrom}
          toValue={dateTo}
          onFromChange={setDateFrom}
          onToChange={setDateTo}
          fromLabel="Period Start"
          toLabel="Period End"
          fromError={errors.dateFrom}
          toError={errors.dateTo}
        />

        {error && (
          <div
            className="flex items-start gap-2 p-3 rounded-xl"
            style={{ background: 'var(--danger-soft)' }}
          >
            <AlertCircle
              size={16}
              style={{
                color: 'var(--danger)',
                flexShrink: 0,
                marginTop: 1,
              }}
            />
            <p className="text-sm" style={{ color: 'var(--danger)' }}>
              {error}
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
}
