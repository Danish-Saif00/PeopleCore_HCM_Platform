'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, Search, ChevronDown, X, Users, DollarSign, Calendar, Star, Clipboard, GitBranch } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { Avatar } from '@/components/ui/Avatar';
import { NotificationDropdown } from '@/components/ui/NotificationDropdown';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

interface TopNavProps {
  onMenuClick?: () => void;
}

interface SearchResult {
  type: 'employee' | 'page';
  label: string;
  subtitle: string;
  href: string;
  icon: React.ReactNode;
}

const PAGE_LINKS: SearchResult[] = [
  { type: 'page', label: 'Dashboard', subtitle: 'Overview & stats', href: '/dashboard', icon: <GitBranch size={14} /> },
  { type: 'page', label: 'Employees', subtitle: 'Manage team members', href: '/employees', icon: <Users size={14} /> },
  { type: 'page', label: 'Payroll', subtitle: 'Run & review payroll', href: '/payroll', icon: <DollarSign size={14} /> },
  { type: 'page', label: 'Time Off', subtitle: 'Leave requests', href: '/time-off', icon: <Calendar size={14} /> },
  { type: 'page', label: 'Reviews', subtitle: 'Performance cycles', href: '/reviews', icon: <Star size={14} /> },
  { type: 'page', label: 'Onboarding', subtitle: 'Templates & checklists', href: '/onboarding', icon: <Clipboard size={14} /> },
  { type: 'page', label: 'Org Chart', subtitle: 'Company hierarchy', href: '/org-chart', icon: <GitBranch size={14} /> },
];

export function TopNav({ onMenuClick }: TopNavProps) {
  const { session, logout } = useAuth();
  const router = useRouter();
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [employees, setEmployees] = useState<Array<{ id: string; fullName: string; jobTitle: string; department: string }>>([]);
  const avatarRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) setAvatarOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Fetch employees once for search
  useEffect(() => {
    if (!session) return;
    fetch('/api/employees')
      .then((r) => r.json())
      .then((d) => { if (d.success) setEmployees(d.data); })
      .catch(() => {});
  }, [session]);

  const runSearch = useCallback((q: string) => {
    const query = q.toLowerCase().trim();
    if (!query) { setSearchResults([]); return; }

    const empResults: SearchResult[] = employees
      .filter((e) => e.fullName.toLowerCase().includes(query) || e.jobTitle.toLowerCase().includes(query) || e.department.toLowerCase().includes(query))
      .slice(0, 4)
      .map((e) => ({
        type: 'employee' as const,
        label: e.fullName,
        subtitle: `${e.jobTitle} · ${e.department}`,
        href: '/employees',
        icon: <Users size={14} />,
      }));

    const pageResults: SearchResult[] = PAGE_LINKS.filter(
      (p) => p.label.toLowerCase().includes(query) || p.subtitle.toLowerCase().includes(query)
    );

    setSearchResults([...empResults, ...pageResults].slice(0, 7));
  }, [employees]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    setSearchOpen(true);
    runSearch(val);
  };

  const handleResultClick = (href: string) => {
    setSearchOpen(false);
    setSearchQuery('');
    router.push(href);
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  const name = session?.email?.split('@')[0] ?? 'User';

  return (
    <header className="top-nav">
      {/* Hamburger (mobile) */}
      <button
        className="md:hidden top-nav-icon-button flex items-center justify-center rounded-lg hover:bg-[color:var(--muted)] text-[color:var(--muted-foreground)]"
        onClick={onMenuClick}
        aria-label="Open navigation"
      >
        <Menu size={20} />
      </button>

      {/* Search */}
      <div className="top-nav-search relative" ref={searchRef}>
        <div className="pc-search-field">
          <Search
            className="pc-search-icon"
            size={15}
          />
          <input
            ref={searchInputRef}
            type="search"
            placeholder="Search employees, pages..."
            className="pc-input pc-search-input pc-search-input-clearable h-9 text-sm"
            style={{ background: 'var(--muted)' }}
            id="global-search"
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => { setSearchOpen(true); runSearch(searchQuery); }}
            autoComplete="off"
          />
          {searchQuery && (
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)]"
              onClick={() => { setSearchQuery(''); setSearchResults([]); searchInputRef.current?.focus(); }}
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Search overlay */}
        {searchOpen && (
          <div
            className="absolute top-full mt-2 left-0 right-0 max-w-md rounded-xl shadow-xl z-50 overflow-hidden border border-[color:var(--border)]"
            style={{ background: 'var(--card)', animation: 'slideDown 0.15s ease' }}
          >
            {searchQuery.trim() === '' ? (
              <div className="p-3">
                <p className="text-xs font-semibold text-[color:var(--muted-foreground)] mb-2 uppercase tracking-wide px-1">Quick Links</p>
                {PAGE_LINKS.slice(0, 5).map((item) => (
                  <button
                    key={item.href}
                    onClick={() => handleResultClick(item.href)}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[color:var(--muted)] transition-colors text-left"
                  >
                    <span className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: 'var(--primary-soft)', color: 'var(--primary)' }}>
                      {item.icon}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-[color:var(--foreground)]">{item.label}</p>
                      <p className="text-xs text-[color:var(--muted-foreground)]">{item.subtitle}</p>
                    </div>
                  </button>
                ))}
              </div>
            ) : searchResults.length > 0 ? (
              <div className="p-2">
                <p className="text-xs font-semibold text-[color:var(--muted-foreground)] mb-1 uppercase tracking-wide px-2 py-1">
                  {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
                </p>
                {searchResults.map((result, i) => (
                  <button
                    key={i}
                    onClick={() => handleResultClick(result.href)}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[color:var(--muted)] transition-colors text-left"
                  >
                    <span
                      className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
                      style={{ background: result.type === 'employee' ? 'var(--primary-soft)' : 'var(--muted)', color: result.type === 'employee' ? 'var(--primary)' : 'var(--muted-foreground)' }}
                    >
                      {result.icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[color:var(--foreground)] truncate">{result.label}</p>
                      <p className="text-xs text-[color:var(--muted-foreground)] truncate">{result.subtitle}</p>
                    </div>
                    {result.type === 'employee' && (
                      <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'var(--primary-soft)', color: 'var(--primary)' }}>
                        Employee
                      </span>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center">
                <Search size={24} className="mx-auto mb-2 text-[color:var(--border)]" />
                <p className="text-sm font-medium text-[color:var(--foreground)]">No results for &ldquo;{searchQuery}&rdquo;</p>
                <p className="text-xs text-[color:var(--muted-foreground)] mt-1">Try searching for an employee name, department, or page.</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="top-nav-actions">
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
