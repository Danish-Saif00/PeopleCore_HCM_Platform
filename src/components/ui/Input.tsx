'use client';
import React, { type InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, helper, leftIcon, rightIcon, className, id, ...props },
  ref
) {
  const inputId = id ?? `input-${Math.random().toString(36).slice(2, 7)}`;
  return (
    <div className="form-group">
      {label && (
        <label htmlFor={inputId} className="form-label">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--muted-foreground)] flex items-center">
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn('pc-input', error && 'error', leftIcon && 'pl-10', rightIcon && 'pr-10', className)}
          {...props}
        />
        {rightIcon && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[color:var(--muted-foreground)] flex items-center">
            {rightIcon}
          </span>
        )}
      </div>
      {error && <p className="form-error">{error}</p>}
      {helper && !error && <p className="text-xs text-[color:var(--muted-foreground)]">{helper}</p>}
    </div>
  );
});
