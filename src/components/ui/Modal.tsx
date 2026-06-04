'use client';
import React, { type ReactNode, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  className,
  size = 'md',
}: ModalProps) {
  const sizeClasses = {
    sm: 'max-w-[400px]',
    md: 'max-w-[520px]',
    lg: 'max-w-[700px]',
    xl: 'max-w-[1000px]',
  }[size];
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="pc-modal-overlay" onClick={onClose}>
      <div
        className={cn('pc-modal', sizeClasses, className)}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="pc-modal-header">
          <div>
            <h2 className="text-lg font-bold text-[color:var(--foreground)]">{title}</h2>
            {subtitle && (
              <p className="text-xs text-[color:var(--muted-foreground)] mt-0.5">{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[color:var(--muted)] text-[color:var(--muted-foreground)] transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="pc-modal-body">{children}</div>

        {/* Footer */}
        {footer && <div className="pc-modal-footer">{footer}</div>}
      </div>
    </div>
  );
}
