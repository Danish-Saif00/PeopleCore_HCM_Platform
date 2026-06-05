'use client';
import React, { type ReactNode, useEffect, useState } from 'react';
import { Sidebar } from './sidebar';
import { TopNav } from './TopNav';
import { cn } from '@/lib/utils';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    setCollapsed(localStorage.getItem('pc_sidebar_collapsed') === 'true');
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((current) => {
      const next = !current;
      localStorage.setItem('pc_sidebar_collapsed', String(next));
      return next;
    });
  };

  return (
    <div className="sidebar-layout">
      <Sidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        collapsed={collapsed}
        onToggleCollapsed={toggleCollapsed}
      />
      <div className={cn('main-content', collapsed && 'sidebar-collapsed')} id="main-content">
        <TopNav onMenuClick={() => setMobileOpen(true)} />
        <main className="app-content">{children}</main>
      </div>
    </div>
  );
}
