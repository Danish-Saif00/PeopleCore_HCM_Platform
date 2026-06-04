'use client';
import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { DateRangePicker } from '@/components/ui/DateRangePicker';

interface RequestTimeOffModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const TYPE_OPTIONS = [
  { value: 'Annual Leave', label: 'Annual Leave' },
  { value: 'Sick Leave', label: 'Sick Leave' },
  { value: 'Unpaid', label: 'Unpaid' },
];

export function RequestTimeOffModal({
  open,
  onClose,
  onSuccess,
}: RequestTimeOffModalProps) {
  const [type, setType] = useState('Annual Leave');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!startDate) e.startDate = 'Start date is required.';
    if (!endDate) e.endDate = 'End date is required.';
    if (startDate && endDate && startDate > endDate)
      e.endDate = 'End date must be after start date.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/time-off', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, startDate, endDate, note }),
      });
      const data = await res.json();
      if (data.success) {
        setType('Annual Leave');
        setStartDate('');
        setEndDate('');
        setNote('');
        setErrors({});
        onSuccess();
        onClose();
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Request Time Off"
      subtitle="Submit a leave request to your manager"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            loading={loading}
            id="submit-time-off"
          >
            Submit Request
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Select
          label="Leave Type"
          options={TYPE_OPTIONS}
          value={type}
          onChange={(e) => setType(e.target.value)}
          id="leave-type"
        />
        <DateRangePicker
          fromValue={startDate}
          toValue={endDate}
          onFromChange={setStartDate}
          onToChange={setEndDate}
          fromLabel="Start Date"
          toLabel="End Date"
          fromError={errors.startDate}
          toError={errors.endDate}
          min={new Date().toISOString().split('T')[0]}
        />
        <Textarea
          label="Note (optional)"
          placeholder="Any additional context for your manager..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          id="time-off-note"
        />
      </div>
    </Modal>
  );
}
