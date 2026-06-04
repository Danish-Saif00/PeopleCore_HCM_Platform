'use client';
import React, { useState } from 'react';
import { SidePanel } from '@/components/ui/SidePanel';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/Badge';
import { Textarea } from '@/components/ui/Textarea';
import type { TimeOffRequest } from '@/types/peoplecore';
import { formatDate, countWorkingDays } from '@/lib/formatters';
import { Calendar, User } from 'lucide-react';

interface TimeOffRequestSidePanelProps {
  request: TimeOffRequest | null;
  employeeName?: string;
  open: boolean;
  onClose: () => void;
  canApprove?: boolean;
  onApprove?: () => void;
  onReject?: () => void;
}

export function TimeOffRequestSidePanel({
  request,
  employeeName,
  open,
  onClose,
  canApprove,
  onApprove,
  onReject,
}: TimeOffRequestSidePanelProps) {
  const [managerNote, setManagerNote] = useState('');
  const [loading, setLoading] = useState(false);

  if (!request) return null;

  const days = countWorkingDays(request.startDate, request.endDate);

  const handleAction = async (action: 'approve' | 'reject') => {
    setLoading(true);
    try {
      const res = await fetch(`/api/time-off/${request.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, managerNote }),
      });
      const data = await res.json();
      if (data.success) {
        setManagerNote('');
        if (action === 'approve') onApprove?.();
        else onReject?.();
        onClose();
      }
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  };

  return (
    <SidePanel
      open={open}
      onClose={onClose}
      title="Time-Off Request"
      subtitle={employeeName}
      footer={
        canApprove && request.status === 'Pending' ? (
          <>
            <Button
              variant="danger"
              onClick={() => handleAction('reject')}
              loading={loading}
              className="flex-1"
              id="reject-time-off"
            >
              Reject
            </Button>
            <Button
              variant="success"
              onClick={() => handleAction('approve')}
              loading={loading}
              className="flex-1"
              id="approve-time-off"
            >
              Approve
            </Button>
          </>
        ) : undefined
      }
    >
      <div className="space-y-5">
        {/* Status row */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-[color:var(--muted-foreground)]">
            Status
          </span>
          <StatusBadge status={request.status} />
        </div>

        {/* Date range card */}
        <div
          className="p-4 rounded-xl"
          style={{ background: 'var(--muted)' }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Calendar size={14} style={{ color: 'var(--primary)' }} />
            <span className="text-sm font-semibold">{request.type}</span>
          </div>
          <p className="text-sm text-[color:var(--muted-foreground)]">
            {formatDate(request.startDate)} — {formatDate(request.endDate)}
          </p>
          <p className="text-xs text-[color:var(--muted-foreground)] mt-1">
            {days} working day{days !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Employee name */}
        {employeeName && (
          <div className="flex items-center gap-2">
            <User
              size={14}
              className="text-[color:var(--muted-foreground)]"
            />
            <span className="text-sm">{employeeName}</span>
          </div>
        )}

        {/* Employee note */}
        {request.note && (
          <div>
            <p className="text-xs text-[color:var(--muted-foreground)] mb-1">
              Employee note
            </p>
            <div className="p-3 rounded-xl border border-[color:var(--border)]">
              <p className="text-sm">{request.note}</p>
            </div>
          </div>
        )}

        {/* Manager note (existing) */}
        {request.managerNote && (
          <div>
            <p className="text-xs text-[color:var(--muted-foreground)] mb-1">
              Manager note
            </p>
            <div className="p-3 rounded-xl border border-[color:var(--border)]">
              <p className="text-sm">{request.managerNote}</p>
            </div>
          </div>
        )}

        {/* Manager note input */}
        {canApprove && request.status === 'Pending' && (
          <Textarea
            label="Manager Note (optional)"
            placeholder="Add a note for the employee..."
            value={managerNote}
            onChange={(e) => setManagerNote(e.target.value)}
          />
        )}
      </div>
    </SidePanel>
  );
}
