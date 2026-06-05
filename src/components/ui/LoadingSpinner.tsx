import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const dim = { sm: 16, md: 24, lg: 40 }[size];
  const border = { sm: 2, md: 3, lg: 4 }[size];
  return (
    <span
      className={cn('inline-block rounded-full border-current border-t-transparent', className)}
      style={{
        width: dim,
        height: dim,
        borderWidth: border,
        borderStyle: 'solid',
        borderTopColor: 'transparent',
        animation: 'spin var(--motion-loading-spin) linear infinite',
      }}
      role="status"
      aria-label="Loading"
    />
  );
}

export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center gap-4">
        <LoadingSpinner size="lg" className="text-[color:var(--primary)]" />
        <p className="text-sm text-[color:var(--muted-foreground)]">Loading...</p>
      </div>
    </div>
  );
}
