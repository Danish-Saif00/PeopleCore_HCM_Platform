'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Bell, Check } from 'lucide-react';
import type { Notification } from '@/types/peoplecore';
import { formatRelativeTime } from '@/lib/formatters';

const TYPE_COLORS: Record<string, string> = {
  Payroll: 'var(--chart-1)',
  'Time Off': 'var(--chart-3)',
  Reviews: 'var(--chart-4)',
  Onboarding: 'var(--chart-2)',
  System: 'var(--chart-5)',
};

interface NotificationDropdownProps {
  userId: string;
}

export function NotificationDropdown({ userId }: NotificationDropdownProps) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const unread = notifications.filter((n) => !n.read).length;

  const load = async () => {
    setLoading(true);
    const res = await fetch('/api/notifications');
    const data = await res.json();
    if (data.success) setNotifications(data.data);
    setLoading(false);
  };

  useEffect(() => { load(); }, [userId]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const markAll = async () => {
    await fetch('/api/notifications', { method: 'PUT' });
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="relative" ref={ref}>
      <button
        id="notification-bell"
        onClick={() => { setOpen(!open); if (!open) load(); }}
        className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[color:var(--muted)] text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] transition-colors"
        aria-label="Notifications"
      >
        <Bell size={18} />
        {unread > 0 && (
          <span className="absolute top-1 right-1 min-w-[16px] h-4 px-0.5 flex items-center justify-center rounded-full text-[10px] font-bold text-white" style={{ background: 'var(--danger)', fontSize: 10 }}>
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="pc-notification-dropdown">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[color:var(--border)]">
            <span className="text-sm font-600 text-[color:var(--foreground)]">Notifications</span>
            {unread > 0 && (
              <button
                onClick={markAll}
                className="flex items-center gap-1 text-xs text-[color:var(--primary)] hover:opacity-70 transition-opacity"
              >
                <Check size={12} /> Mark all as read
              </button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <p className="text-center py-6 text-sm text-[color:var(--muted-foreground)]">Loading...</p>
            ) : notifications.length === 0 ? (
              <p className="text-center py-8 text-sm text-[color:var(--muted-foreground)]">No notifications</p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className="flex gap-3 px-4 py-3 border-b border-[color:var(--border)] last:border-b-0 hover:bg-[color:var(--muted)] transition-colors"
                  style={{ background: !n.read ? 'var(--primary-soft)' : undefined }}
                >
                  <span
                    className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                    style={{ background: TYPE_COLORS[n.type] ?? 'var(--muted-foreground)', opacity: n.read ? 0.4 : 1 }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-500 text-[color:var(--foreground)] leading-snug">{n.title}</p>
                    <p className="text-xs text-[color:var(--muted-foreground)] mt-0.5 leading-relaxed">{n.message}</p>
                    <p className="text-xs text-[color:var(--muted-foreground)] mt-1">{formatRelativeTime(n.createdAt)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
