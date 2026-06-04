'use client';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Menu, Search, ChevronDown } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { Avatar } from '@/components/ui/Avatar';
import { NotificationDropdown } from '@/components/ui/NotificationDropdown';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

interface TopNavProps {
  onMenuClick?: () => void;
}

export function TopNav({ onMenuClick }: TopNavProps) {
  const { session, logout } = useAuth();
  const [avatarOpen, setAvatarOpen] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) setAvatarOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  const name = session?.email?.split('@')[0] ?? 'User';

  return (
    <header className="top-nav">
      {/* Hamburger (mobile) */}
      <button
        className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[color:var(--muted)] text-[color:var(--muted-foreground)] mr-1"
        onClick={onMenuClick}
        aria-label="Open navigation"
      >
        <Menu size={20} />
      </button>

      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--muted-foreground)]" size={15} />
          <input
            type="search"
            placeholder="Search employees, payroll..."
            className="pc-input pl-9 h-9 text-sm"
            style={{ background: 'var(--muted)' }}
            id="global-search"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <ThemeToggle />
        {/* Notifications */}
        {session && <NotificationDropdown userId={session.userId} />}

        {/* Avatar dropdown */}
        <div className="relative" ref={avatarRef}>
          <button
            id="avatar-menu"
            onClick={() => setAvatarOpen(!avatarOpen)}
            className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-[color:var(--muted)] transition-colors"
          >
            <Avatar name={name} size="sm" />
            <span className="hidden sm:block text-sm font-medium text-[color:var(--foreground)] capitalize max-w-[120px] truncate">
              {name.replace(/[._-]/g, ' ')}
            </span>
            <ChevronDown size={14} className="text-[color:var(--muted-foreground)]" />
          </button>

          {avatarOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-[color:var(--card)] border border-[color:var(--border)] rounded-xl shadow-lg overflow-hidden z-50" style={{ animation: 'slideDown 0.15s ease' }}>
              <div className="px-3 py-2.5 border-b border-[color:var(--border)]">
                <p className="text-xs font-medium text-[color:var(--foreground)] truncate">{session?.email}</p>
                <p className="text-xs text-[color:var(--muted-foreground)]">{session?.role}</p>
              </div>
              <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-[color:var(--muted)] transition-colors" onClick={() => setAvatarOpen(false)}>My Dashboard</Link>
              <button onClick={handleLogout} className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-[color:var(--danger)] hover:bg-[color:var(--danger-soft)] transition-colors">
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
