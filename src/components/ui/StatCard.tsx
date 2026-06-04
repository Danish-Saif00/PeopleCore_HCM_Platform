'use client';
import React, { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  iconColor?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  iconColor = 'var(--primary)',
  className,
}: StatCardProps) {
  return (
    <div className={cn('pc-stat-card flex items-center justify-between', className)}>
      <div className="space-y-1">
        <p className="text-xs text-[color:var(--muted-foreground)] uppercase tracking-wider font-semibold">
          {title}
        </p>
        <h3 className="text-2xl font-bold text-[color:var(--foreground)]">{value}</h3>
        {subtitle && <p className="text-xs text-[color:var(--muted-foreground)]">{subtitle}</p>}
      </div>
      {icon && (
        <div
          className="p-3 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${iconColor}15`, color: iconColor }}
        >
          {icon}
        </div>
      )}
    </div>
  );
}
