'use client';
import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { Employee } from '@/types/peoplecore';

interface CreateReviewCycleModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  employees?: Employee[];
}

export function CreateReviewCycleModal({
  open,
  onClose,
  onSuccess,
  employees,
}: CreateReviewCycleModalProps) {
  const [internalEmployees, setInternalEmployees] = useState<Employee[]>(employees || []);

  useEffect(() => {
    if (employees) {
      setInternalEmployees(employees);
    } else if (open) {
      fetch('/api/employees')
        .then((res) => res.json())
        .then((json) => {
          if (json.success) {
            setInternalEmployees(json.data);
          }
        });
    }
  }, [employees, open]);
  const [name, setName] = useState('');
  const [period, setPeriod] = useState('');
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const toggleEmployee = (id: string) =>
    setSelectedEmployeeIds((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Cycle name is required.';
    if (!period.trim()) e.period = 'Period is required.';
    if (selectedEmployeeIds.length === 0)
      e.employees = 'Select at least one employee.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create-cycle',
          name,
          period,
          employeeIds: selectedEmployeeIds,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setName('');
        setPeriod('');
        setSelectedEmployeeIds([]);
        setErrors({});
        onSuccess();
        onClose();
      }
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Create Review Cycle"
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            loading={loading}
            id="create-review-cycle"
          >
            Create Cycle
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Input
          id="cycle-name"
          label="Cycle Name *"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setErrors((p) => ({ ...p, name: '' }));
          }}
          error={errors.name}
          placeholder="e.g. Q2 2025 Performance Review"
        />
        <Input
          id="cycle-period"
          label="Period *"
          value={period}
          onChange={(e) => {
            setPeriod(e.target.value);
            setErrors((p) => ({ ...p, period: '' }));
          }}
          error={errors.period}
          placeholder="e.g. 01/04/2025 - 30/06/2025"
        />
        <div>
          <label className="form-label mb-2 block">Select Employees *</label>
          <div className="max-h-48 overflow-y-auto border border-[color:var(--border)] rounded-xl">
            {internalEmployees
              .filter((e) => e.status === 'Active')
              .map((emp) => (
                <label
                  key={emp.id}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-[color:var(--muted)] cursor-pointer border-b border-[color:var(--border)] last:border-0"
                >
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded accent-[color:var(--primary)]"
                    checked={selectedEmployeeIds.includes(emp.id)}
                    onChange={() => toggleEmployee(emp.id)}
                  />
                  <div>
                    <p className="text-sm font-medium">{emp.fullName}</p>
                    <p className="text-xs text-[color:var(--muted-foreground)]">
                      {emp.jobTitle} · {emp.department}
                    </p>
                  </div>
                </label>
              ))}
          </div>
          {errors.employees && (
            <p className="form-error mt-1">{errors.employees}</p>
          )}
        </div>
      </div>
    </Modal>
  );
}
