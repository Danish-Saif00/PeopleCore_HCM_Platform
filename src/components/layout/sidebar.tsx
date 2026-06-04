'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Users, DollarSign, FileText, Calendar, UserCheck,
  GitBranch, Clipboard, Star, Building2, CreditCard, Shield, LogOut,
  ChevronLeft, ChevronRight, X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth-context';
import { getNavItems } from '@/lib/permissions';
import type { Role } from '@/types/peoplecore';
import { Avatar } from '@/components/ui/Avatar';
import { Logo } from '@/components/ui/Logo';

const ICON_MAP: Record<string, React.ElementType> = {
  LayoutDashboard, Users, DollarSign, FileText, Calendar, UserCheck,
  GitBranch, Clipboard, Star, Building2, CreditCard, Shield,
};

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
  collapsed?: boolean;
  onToggleCollapsed?: () => void;
}

export function Sidebar({
  mobileOpen,
  onMobileClose,
  collapsed = false,
  onToggleCollapsed,
}: SidebarProps) {
  const pathname = usePathname();
  const { session, logout } = useAuth();
  const role = session?.role as Role | undefined;
  const navItems = role ? getNavItems(role) : [];

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  const isActive = (href: string) =>
    pathname === href || (href !== '/dashboard' && pathname.startsWith(href));

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={onMobileClose} />
      )}
      <aside
        className={cn(
          'sidebar-nav',
          collapsed && 'collapsed',
          mobileOpen ? 'mobile-open' : 'mobile-hidden',
          'lg:translate-x-0'
        )}
      >
        <div className={cn('flex items-center gap-3 px-4 py-5 border-b border-white/10', collapsed && 'justify-center px-3')}>
          <Link href="/dashboard" onClick={onMobileClose} aria-label="PeopleCore dashboard">
            <Logo
              variant={collapsed ? 'dark-mark-only' : 'dark-horizontal-short'}
              size={collapsed ? 'sm' : 'md'}
              priority
            />
          </Link>
          {onMobileClose && (
            <button onClick={onMobileClose} className="ml-auto text-[color:var(--sidebar-muted)] lg:hidden">
              <X size={16} />
            </button>
          )}
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-4 overflow-y-auto overflow-x-hidden" aria-label="Main navigation">
          <div className="space-y-0.5 px-2">
            {navItems.map((item) => {
              const Icon = ICON_MAP[item.icon];
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onMobileClose}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm',
                    active
                      ? 'text-white font-medium'
                      : 'text-[color:var(--sidebar-muted)] hover:text-[color:var(--sidebar-foreground)]'
                  )}
                  style={active ? { background: 'var(--sidebar-active-bg)', color: 'var(--sidebar-active)' } : undefined}
                  title={collapsed ? item.label : undefined}
                  aria-current={active ? 'page' : undefined}
                >
                  {Icon && <Icon size={18} className="flex-shrink-0" />}
                  <span className="sidebar-label truncate">{item.label}</span>
                  {active && !collapsed && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--sidebar-active)' }} />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User + logout */}
        <div className="border-t border-white/10 p-3">
          {!collapsed && session && (
            <div className="flex items-center gap-3 px-2 py-2 mb-2">
              <Avatar name={session.email} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-[color:var(--sidebar-foreground)] truncate">{session.email}</p>
                <p className="text-xs text-[color:var(--sidebar-muted)] truncate">{session.role}</p>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-[color:var(--sidebar-muted)] hover:text-[color:var(--sidebar-foreground)] hover:bg-white/5 transition-colors text-sm"
          >
            <LogOut size={18} className="flex-shrink-0" />
            <span className="sidebar-label">Log out</span>
          </button>
        </div>

        {/* Collapse toggle (desktop only) */}
        <button
          className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 rounded-full border border-white/10 bg-[color:var(--sidebar)] items-center justify-center text-[color:var(--sidebar-muted)] hover:text-[color:var(--sidebar-foreground)] shadow-md z-10 transition-all duration-200 hover:scale-110 cursor-pointer"
          onClick={onToggleCollapsed}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </aside>
    </>
  );
}
