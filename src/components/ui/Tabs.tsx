'use client';
import React from 'react';
import { cn } from '@/lib/utils';

interface Tab {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeTab, onChange, className }: TabsProps) {
  return (
    <div className={cn('flex border-b border-[color:var(--border)] overflow-x-auto gap-4', className)}>
      {tabs.map((tab) => {
        const active = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              'pb-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap cursor-pointer',
              active
                ? 'border-[color:var(--primary)] text-[color:var(--primary)] font-semibold'
                : 'border-transparent text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)]'
            )}
            style={active ? { borderBottomColor: 'var(--primary)', color: 'var(--primary)' } : undefined}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
