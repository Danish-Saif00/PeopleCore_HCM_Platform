'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Menu } from 'lucide-react';
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
    const handler = (event: MouseEvent) => {
      if (avatarRef.current && !avatarRef.current.contains(event.target as Node)) {
        setAvatarOpen(false);
      }
    };

    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  const name = session?.fullName ?? session?.email?.split('@')[0] ?? 'User';

  return (
    <header className="top-nav">
      <button
        className="md:hidden top-nav-icon-button flex items-center justify-center rounded-lg hover:bg-[color:var(--muted)] text-[color:var(--muted-foreground)]"
        onClick={onMenuClick}
        aria-label="Open navigation"
      >
        <Menu size={20} />
      </button>

      <div className="top-nav-actions">
        <ThemeToggle />
        {session && <NotificationDropdown userId={session.userId} />}

        <div className="relative" ref={avatarRef}>
          <button
            id="avatar-menu"
            onClick={() => setAvatarOpen(!avatarOpen)}
            className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-[color:var(--muted)] transition-colors"
          >
            <Avatar name={name} avatarUrl={session?.avatarUrl} size="sm" />
            <span className="hidden sm:block text-sm font-medium text-[color:var(--foreground)] capitalize max-w-[120px] truncate">
              {name.replace(/[._-]/g, ' ')}
            </span>
            <ChevronDown size={14} className="text-[color:var(--muted-foreground)]" />
          </button>

          {avatarOpen && (
            <div className="motion-dropdown absolute right-0 top-full mt-2 w-48 bg-[color:var(--card)] border border-[color:var(--border)] rounded-xl shadow-lg overflow-hidden z-50">
              <div className="px-3 py-2.5 border-b border-[color:var(--border)]">
                <p className="text-xs font-medium text-[color:var(--foreground)] truncate">{session?.email}</p>
                <p className="text-xs text-[color:var(--muted-foreground)]">{session?.role}</p>
              </div>
              <Link
                href="/profile"
                className="flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-[color:var(--muted)] transition-colors"
                onClick={() => setAvatarOpen(false)}
              >
                My Profile
              </Link>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-[color:var(--danger)] hover:bg-[color:var(--danger-soft)] transition-colors"
              >
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
