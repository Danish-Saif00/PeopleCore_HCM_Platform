'use client';
import React, { type TextareaHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, error, className, id, ...props },
  ref
) {
  const textareaId = id ?? `textarea-${Math.random().toString(36).slice(2, 7)}`;
  return (
    <div className="form-group">
      {label && (
        <label htmlFor={textareaId} className="form-label">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        className={cn('pc-textarea', error && 'error', className)}
        {...props}
      />
      {error && <p className="form-error">{error}</p>}
    </div>
  );
});
