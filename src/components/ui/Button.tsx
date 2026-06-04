'use client';
import React, { type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: ReactNode;
  iconRight?: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconRight,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const variantClass = {
    primary: 'pc-btn-primary',
    secondary: 'pc-btn-secondary',
    ghost: 'pc-btn-ghost',
    danger: 'pc-btn-danger',
    success: 'pc-btn-success',
  }[variant];
  const sizeClass = { sm: 'pc-btn-sm', md: '', lg: 'pc-btn-lg' }[size];

  return (
    <button
      className={cn('pc-btn', variantClass, sizeClass, className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full" style={{ animation: 'spin 0.6s linear infinite' }} />
      ) : icon}
      {children}
      {!loading && iconRight}
    </button>
  );
}