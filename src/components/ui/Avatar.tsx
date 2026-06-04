'use client';
import React from 'react';
import { cn } from '@/lib/utils';
import { getInitials } from '@/lib/formatters';

interface AvatarProps {
  name?: string;
  avatarUrl?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function Avatar({ name = '', avatarUrl, size = 'md', className }: AvatarProps) {
  const initials = getInitials(name);

  const sizeClass = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-20 h-20 text-2xl',
  }[size];

  return (
    <div className={cn('pc-avatar', sizeClass, className)}>
      {avatarUrl ? (
        <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}
