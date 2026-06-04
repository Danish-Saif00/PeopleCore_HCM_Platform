'use client';
import React, { type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon = <Inbox size={32} className="text-[color:var(--muted-foreground)]" />,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn('pc-empty-state', className)}>
      <div className="w-16 h-16 rounded-full bg-[color:var(--muted)] flex items-center justify-center mb-2">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-base text-[color:var(--foreground)]">{title}</h3>
        <p className="text-sm text-[color:var(--muted-foreground)] mt-1 max-w-sm">
          {description}
        </p>
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
