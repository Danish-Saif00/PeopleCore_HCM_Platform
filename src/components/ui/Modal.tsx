'use client';
import React, { type ReactNode, useEffect, useId, useState } from 'react';
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
  const titleId = useId();
  const subtitleId = useId();
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);
  const sizeClasses = {
    sm: 'max-w-[400px]',
    md: 'max-w-[520px]',
    lg: 'max-w-[700px]',
    xl: 'max-w-[1000px]',
  }[size];

  useEffect(() => {
    if (open) {
      setMounted(true);
      const frame = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(frame);
    }

    setVisible(false);
    const timeout = window.setTimeout(() => setMounted(false), 420);
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
    <div className={cn('pc-modal-overlay', visible && 'open')} onClick={onClose}>
      <div
        className={cn('pc-modal', visible && 'open', sizeClasses, className)}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={subtitle ? subtitleId : undefined}
      >
        {/* Header */}
        <div className="pc-modal-header">
          <div>
            <h2 id={titleId} className="text-lg font-bold text-[color:var(--foreground)]">{title}</h2>
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
        <div className="pc-modal-body">{children}</div>

        {/* Footer */}
        {footer && <div className="pc-modal-footer">{footer}</div>}
      </div>
    </div>
  );
}
