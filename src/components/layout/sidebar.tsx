"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  DollarSign,
  FileText,
  Calendar,
  UserCheck,
  GitBranch,
  Clipboard,
  Star,
  Building2,
  CreditCard,
  Shield,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  X,
  Contact,
  UserRound,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { getNavItems } from "@/lib/permissions";
import type { Role } from "@/types/peoplecore";
import { Avatar } from "@/components/ui/Avatar";
import { Logo } from "@/components/ui/Logo";

const ICON_MAP: Record<string, React.ElementType> = {
  LayoutDashboard,
  Users,
  DollarSign,
  FileText,
  Calendar,
  UserCheck,
  GitBranch,
  Clipboard,
  Star,
  Building2,
  CreditCard,
  Shield,
  Contact,
  UserRound,
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
  const { session } = useAuth();
  const role = session?.role as Role | undefined;
  const navItems = role ? getNavItems(role) : [];

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

  const isActive = (href: string) =>
    pathname === href || (href !== "/dashboard" && pathname.startsWith(href));

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          className="sidebar-mobile-overlay md:hidden"
          onClick={onMobileClose}
          aria-label="Close navigation"
        />
      )}

      <aside
        className={cn(
          "sidebar-nav",
          collapsed && "collapsed",
          mobileOpen && "mobile-open",
          "md:translate-x-0",
        )}
      >
        <header className="sidebar-header">
          <div className="sidebar-expanded-header">
            <Link
              href="/dashboard"
              onClick={onMobileClose}
              aria-label="PeopleCore dashboard"
            >
              <Logo variant="dark-horizontal-short" size="md" priority />
            </Link>
            <button
              type="button"
              className="sidebar-control-button"
              onClick={onToggleCollapsed}
              aria-label="Collapse sidebar"
              title="Collapse sidebar"
            >
              <PanelLeftClose size={19} />
            </button>
          </div>

          <button
            type="button"
            className="sidebar-collapsed-toggle"
            onClick={onToggleCollapsed}
            aria-label="Expand sidebar"
            title="Expand sidebar"
          >
            <Logo
              variant="dark-mark-only"
              size="sm"
              priority
              className="sidebar-collapsed-logo"
            />
            <PanelLeftOpen size={20} className="sidebar-expand-icon" />
          </button>

          <div className="sidebar-mobile-header">
            <Link
              href="/dashboard"
              onClick={onMobileClose}
              aria-label="PeopleCore dashboard"
            >
              <Logo variant="dark-horizontal-short" size="md" priority />
            </Link>
            <button
              type="button"
              onClick={onMobileClose}
              className="sidebar-control-button"
              aria-label="Close navigation"
            >
              <X size={19} />
            </button>
          </div>
        </header>

        <nav className="sidebar-nav-list" aria-label="Main navigation">
          {navItems.map((item) => {
            const Icon = ICON_MAP[item.icon];
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onMobileClose}
                className={cn("sidebar-nav-item", active && "active")}
                title={collapsed ? item.label : undefined}
                aria-current={active ? "page" : undefined}
              >
                {Icon && <Icon size={19} className="sidebar-nav-icon" />}
                <span className="sidebar-label">{item.label}</span>
                {active && <span className="sidebar-active-dot" />}
              </Link>
            );
          })}
        </nav>

        <footer className="sidebar-footer">
          {session && (
            <div className="sidebar-account">
              <Avatar
                name={session.fullName ?? session.email}
                avatarUrl={session.avatarUrl}
                size="sm"
              />
              <div className="sidebar-account-copy">
                <p>{session.fullName ?? session.email}</p>
                <span>{session.role}</span>
              </div>
            </div>
          )}
          <button
            type="button"
            onClick={handleLogout}
            className="sidebar-nav-item sidebar-logout"
            title={collapsed ? "Log out" : undefined}
          >
            <LogOut size={19} className="sidebar-nav-icon" />
            <span className="sidebar-label">Log out</span>
          </button>
        </footer>
      </aside>
    </>
  );
}
