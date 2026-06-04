'use client';
import React, { type ReactNode, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface SidePanelProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function SidePanel({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  className,
}: SidePanelProps) {
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

  return (
    <>
      {open && (
        <div className="pc-side-panel-overlay" onClick={onClose} />
      )}
      <div
        className={cn('pc-side-panel', open ? 'translate-x-0' : 'translate-x-full', className)}
        style={{ display: open ? 'flex' : 'none' }}
      >
        {/* Header */}
        <div className="pc-side-panel-header">
          <div>
            <h2 className="text-base font-bold text-[color:var(--foreground)]">{title}</h2>
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
        <div className="pc-side-panel-body">{children}</div>

        {/* Footer */}
        {footer && <div className="pc-side-panel-footer">{footer}</div>}
      </div>
    </>
  );
}
