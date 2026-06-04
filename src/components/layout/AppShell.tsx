'use client';
import React, { type ReactNode, useState } from 'react';
import { Sidebar } from './sidebar';
import { TopNav } from './TopNav';
import { cn } from '@/lib/utils';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="sidebar-layout">
      <Sidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        collapsed={collapsed}
        onToggleCollapsed={() => setCollapsed(!collapsed)}
      />
      <div className={cn('main-content', collapsed && 'sidebar-collapsed')} id="main-content">
        <TopNav onMenuClick={() => setMobileOpen(true)} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
