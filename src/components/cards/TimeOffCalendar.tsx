'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import type { Employee, TimeOffRequest } from '@/types/peoplecore';

interface TimeOffCalendarProps {
  requests: TimeOffRequest[];
  employees: Employee[];
  loading?: boolean;
}

const TYPE_COLORS: Record<string, { background: string; color: string }> = {
  'Annual Leave': { background: 'var(--primary-soft)', color: 'var(--primary)' },
  'Sick Leave': { background: 'var(--warning-soft)', color: 'var(--warning)' },
  Unpaid: { background: 'var(--danger-soft)', color: 'var(--danger)' },
};

function parseDate(value: string): Date {
  return new Date(`${value}T12:00:00`);
}

function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function startOfWeek(date: Date): Date {
  const next = new Date(date);
  next.setDate(next.getDate() - next.getDay());
  next.setHours(12, 0, 0, 0);
  return next;
}

function getInitialDate(requests: TimeOffRequest[]): Date {
  const latestApproved = [...requests]
    .filter((request) => request.status === 'Approved')
    .sort((a, b) => b.startDate.localeCompare(a.startDate))[0];

  return startOfWeek(latestApproved ? parseDate(latestApproved.startDate) : new Date());
}

export function TimeOffCalendar({ requests, employees, loading = false }: TimeOffCalendarProps) {
  const [baseDate, setBaseDate] = useState(() => startOfWeek(new Date()));
  const initializedFromData = useRef(false);

  useEffect(() => {
    if (!initializedFromData.current && requests.length > 0) {
      setBaseDate(getInitialDate(requests));
      initializedFromData.current = true;
    }
  }, [requests]);

  const employeesById = useMemo(
    () => new Map(employees.map((employee) => [employee.id, employee])),
    [employees]
  );
  const days = useMemo(
    () =>
      Array.from({ length: 14 }, (_, index) => {
        const date = new Date(baseDate);
        date.setDate(baseDate.getDate() + index);
        return date;
      }),
    [baseDate]
  );

  const shiftWeek = (amount: number) => {
    setBaseDate((current) => {
      const next = new Date(current);
      next.setDate(next.getDate() + amount * 7);
      return next;
    });
  };

  const requestsForDay = (date: Date) => {
    const key = toDateKey(date);
    return requests.filter(
      (request) =>
        request.status === 'Approved' && request.startDate <= key && request.endDate >= key
    );
  };

  const rangeLabel = `${days[0].toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })} - ${days[13].toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })}`;

  return (
    <section className="pc-card overflow-hidden" aria-labelledby="time-off-calendar-title">
      <div className="flex flex-col gap-3 border-b border-[color:var(--border)] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[color:var(--primary-soft)] text-[color:var(--primary)]">
            <CalendarDays size={18} />
          </div>
          <div className="min-w-0">
            <h2 id="time-off-calendar-title" className="card-title">
              Team Absences Calendar
            </h2>
            <p className="truncate text-xs text-[color:var(--muted-foreground)]">{rangeLabel}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => shiftWeek(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-[color:var(--border)] text-[color:var(--muted-foreground)] hover:bg-[color:var(--muted)] hover:text-[color:var(--foreground)]"
            aria-label="Show previous week"
            title="Previous week"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => shiftWeek(1)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-[color:var(--border)] text-[color:var(--muted-foreground)] hover:bg-[color:var(--muted)] hover:text-[color:var(--foreground)]"
            aria-label="Show next week"
            title="Next week"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-2 p-4 sm:grid-cols-4 lg:grid-cols-7" role="status" aria-label="Loading absence calendar">
          {Array.from({ length: 14 }, (_, index) => (
            <div key={index} className="skeleton min-h-28 rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2 p-3 sm:grid-cols-4 sm:p-4 lg:grid-cols-7">
          {days.map((date) => {
            const dayRequests = requestsForDay(date);
            const isWeekend = date.getDay() === 0 || date.getDay() === 6;
            const isToday = toDateKey(date) === toDateKey(new Date());

            return (
              <article
                key={toDateKey(date)}
                className="min-h-28 overflow-hidden rounded-lg border p-2.5"
                style={{
                  borderColor: isToday ? 'var(--primary)' : 'var(--border)',
                  background: isWeekend ? 'var(--muted)' : 'var(--card)',
                }}
                aria-label={`${date.toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}: ${dayRequests.length} approved absences`}
              >
                <div className="mb-2 flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[11px] font-semibold uppercase text-[color:var(--muted-foreground)]">
                      {date.toLocaleDateString('en-US', { weekday: 'short' })}
                    </p>
                    <p className="text-sm font-bold text-[color:var(--foreground)]">
                      {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                  {isToday && (
                    <span className="rounded bg-[color:var(--primary-soft)] px-1.5 py-0.5 text-[10px] font-semibold text-[color:var(--primary)]">
                      Today
                    </span>
                  )}
                </div>

                <div className="space-y-1.5">
                  {dayRequests.length === 0 ? (
                    <p className="pt-2 text-[11px] text-[color:var(--muted-foreground)]">No absences</p>
                  ) : (
                    dayRequests.slice(0, 3).map((request) => {
                      const employee = employeesById.get(request.employeeId);
                      const colors = TYPE_COLORS[request.type] ?? TYPE_COLORS['Annual Leave'];
                      return (
                        <div
                          key={request.id}
                          className="flex min-w-0 items-center gap-1.5 rounded-md px-1.5 py-1"
                          style={{ background: colors.background, color: colors.color }}
                          title={`${employee?.fullName ?? 'Employee'} - ${request.type}`}
                        >
                          <Avatar
                            name={employee?.fullName ?? 'Employee'}
                            avatarUrl={employee?.avatarUrl}
                            size="sm"
                            className="h-5 w-5 shrink-0 text-[8px]"
                          />
                          <span className="truncate text-[10px] font-semibold">
                            {employee?.fullName?.split(' ')[0] ?? 'Employee'}
                          </span>
                        </div>
                      );
                    })
                  )}
                  {dayRequests.length > 3 && (
                    <p className="text-[10px] font-medium text-[color:var(--muted-foreground)]">
                      +{dayRequests.length - 3} more
                    </p>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
