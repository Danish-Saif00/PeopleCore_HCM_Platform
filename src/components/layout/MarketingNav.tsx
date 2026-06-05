'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/ui/Logo';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export function MarketingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const links = [
    { href: '#features', label: 'Features' },
    { href: '#pricing', label: 'Pricing' },
    { href: '#customers', label: 'Customers' },
    { href: '#blog', label: 'Blog' },
  ];

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all',
        scrolled ? 'bg-[color:var(--card)]/95 backdrop-blur-sm shadow-sm border-b border-[color:var(--border)]' : 'bg-transparent'
      )}
      style={{ height: 64 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center gap-8">
        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
          <Logo variant="light-horizontal-long" size="md" priority className="theme-logo-light" />
          <Logo variant="dark-horizontal-long" size="md" priority className="theme-logo-dark" />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6 flex-1 justify-center">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3 ml-auto">
          <ThemeToggle />
          <Link href="/login" className="pc-btn pc-btn-ghost pc-btn-sm">Login</Link>
          <Link href="/signup" className="pc-btn pc-btn-primary pc-btn-sm">Start Free Trial</Link>
        </div>

        {/* Mobile menu triggers */}
        <div className="flex items-center gap-2 md:hidden ml-auto">
          <ThemeToggle />
          <button
            className="w-12 h-12 flex items-center justify-center rounded-lg hover:bg-[color:var(--muted)] text-[color:var(--foreground)]"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="motion-dropdown md:hidden absolute top-16 left-0 right-0 bg-[color:var(--card)] border-b border-[color:var(--border)] shadow-lg p-4 flex flex-col gap-3">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm py-2 text-[color:var(--foreground)]" onClick={() => setMobileOpen(false)}>{link.label}</Link>
          ))}
          <div className="flex gap-3 pt-2 border-t border-[color:var(--border)]">
            <Link href="/login" className="pc-btn pc-btn-ghost flex-1" onClick={() => setMobileOpen(false)}>Login</Link>
            <Link href="/signup" className="pc-btn pc-btn-primary flex-1" onClick={() => setMobileOpen(false)}>Sign Up</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
