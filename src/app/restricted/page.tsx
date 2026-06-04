import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ShieldOff } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Access Restricted',
  description: 'You do not have permission to view this page.',
};

export default function RestrictedPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'var(--background)' }}
    >
      <div className="text-center max-w-md">
        {/* Icon */}
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: 'var(--danger-soft)' }}
        >
          <ShieldOff size={36} style={{ color: 'var(--danger)' }} />
        </div>

        <h1 className="text-2xl font-bold text-[color:var(--foreground)] mb-3">
          Access Restricted
        </h1>
        <p className="text-[color:var(--muted-foreground)] mb-8 leading-relaxed">
          You don&apos;t have permission to view this page. Contact your HR admin if you
          believe this is a mistake.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90"
            style={{
              background: 'var(--primary)',
              color: 'var(--primary-foreground)',
            }}
            id="back-to-dashboard"
          >
            Back to Dashboard
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl text-sm font-semibold border border-[color:var(--border)] transition-colors hover:bg-[color:var(--muted)]"
            style={{ color: 'var(--foreground)' }}
          >
            Switch Account
          </Link>
        </div>
      </div>
    </div>
  );
}
