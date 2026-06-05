'use client';
import React, { type ReactNode, useEffect, useId, useState } from 'react';
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
  const titleId = useId();
  const subtitleId = useId();
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      const frame = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(frame);
    }

    setVisible(false);
    const timeout = window.setTimeout(() => setMounted(false), 260);
    return () => window.clearTimeout(timeout);
  }, [open]);

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

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!mounted) return null;

  return (
    <>
      <div className={cn('pc-side-panel-overlay', visible && 'open')} onClick={onClose} />
      <div
        className={cn('pc-side-panel', visible && 'open', className)}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={subtitle ? subtitleId : undefined}
      >
        {/* Header */}
        <div className="pc-side-panel-header">
          <div>
            <h2 id={titleId} className="text-base font-bold text-[color:var(--foreground)]">{title}</h2>
            {subtitle && (
              <p id={subtitleId} className="text-xs text-[color:var(--muted-foreground)] mt-0.5">{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-[color:var(--muted)] text-[color:var(--muted-foreground)] transition-colors"
            aria-label={`Close ${title}`}
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
