'use client';
import React, { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'muted';
  children: ReactNode;
  className?: string;
}

export function Badge({ variant = 'primary', children, className }: BadgeProps) {
  const variantClass = {
    primary: 'pc-badge-primary',
    success: 'pc-badge-success',
    warning: 'pc-badge-warning',
    danger: 'pc-badge-danger',
    info: 'pc-badge-info',
    muted: 'pc-badge-muted',
  }[variant];

  return (
    <span className={cn('pc-badge', variantClass, className)}>
      {children}
    </span>
  );
}

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const norm = (status || '').toLowerCase().trim();
  let variant: 'success' | 'warning' | 'danger' | 'info' | 'muted' = 'muted';

  if (['active', 'approved', 'completed', 'success', 'sent'].includes(norm)) {
    variant = 'success';
  } else if (['pending', 'processing', 'draft', 'on leave', 'in progress'].includes(norm)) {
    variant = 'warning';
  } else if (['inactive', 'terminated', 'rejected', 'failed', 'cancelled'].includes(norm)) {
    variant = 'danger';
  } else if (['info', 'system'].includes(norm)) {
    variant = 'info';
  }

  return (
    <Badge variant={variant} className={className}>
      {status}
    </Badge>
  );
}
