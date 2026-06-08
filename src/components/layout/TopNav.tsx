"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, Menu, Search } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Avatar } from "@/components/ui/Avatar";
import { NotificationDropdown } from "@/components/ui/NotificationDropdown";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useDebounce } from "@/lib/debounce";

interface TopNavProps {
  onMenuClick?: () => void;
}

export function TopNav({ onMenuClick }: TopNavProps) {
  const { session } = useAuth();
  const [avatarOpen, setAvatarOpen] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Array<{ id: string; fullName: string; jobTitle: string; department: string }>>([]);
  const debouncedSearch = useDebounce(search, 200);

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (
        avatarRef.current &&
        !avatarRef.current.contains(event.target as Node)
      ) {
        setAvatarOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (debouncedSearch.trim().length < 2) {
      setResults([]);
      return;
    }
    fetch(`/api/employees/search?q=${encodeURIComponent(debouncedSearch)}`)
      .then((response) => response.json())
      .then((result) => setResults(result.success ? result.data : []))
      .catch(() => setResults([]));
  }, [debouncedSearch]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } finally {
      window.location.replace("/");
    }
  };

  const name = session?.fullName ?? session?.email?.split("@")[0] ?? "User";

  return (
    <header className="top-nav">
      <button
        className="md:hidden top-nav-icon-button flex items-center justify-center rounded-lg hover:bg-[color:var(--muted)] text-[color:var(--muted-foreground)]"
        onClick={onMenuClick}
        aria-label="Open navigation"
      >
        <Menu size={20} />
      </button>

      <div className="top-nav-search pc-search-field hidden md:block">
        <Search size={16} className="pc-search-icon" />
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search employees by name" aria-label="Search employees by name" className="pc-input pc-search-input" />
        {results.length > 0 && (
          <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-[color:var(--border)] bg-[color:var(--card)] shadow-lg">
            {results.map((employee) => (
              <Link key={employee.id} href="/company-directory" onClick={() => { setSearch(""); setResults([]); }} className="block px-4 py-3 hover:bg-[color:var(--muted)]">
                <p className="text-sm font-medium">{employee.fullName}</p>
                <p className="text-xs text-[color:var(--muted-foreground)]">{employee.jobTitle} · {employee.department}</p>
              </Link>
            ))}
          </div>
        )}
      </div>

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
              {name.replace(/[._-]/g, " ")}
            </span>
            <ChevronDown
              size={14}
              className="text-[color:var(--muted-foreground)]"
            />
          </button>

          {avatarOpen && (
            <div className="motion-dropdown absolute right-0 top-full mt-2 w-48 bg-[color:var(--card)] border border-[color:var(--border)] rounded-xl shadow-lg overflow-hidden z-50">
              <div className="px-3 py-2.5 border-b border-[color:var(--border)]">
                <p className="text-xs font-medium text-[color:var(--foreground)] truncate">
                  {session?.email}
                </p>
                <p className="text-xs text-[color:var(--muted-foreground)]">
                  {session?.role}
                </p>
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
