'use client';
import React, { useEffect, useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/lib/auth-context';
import { formatCurrency } from '@/lib/formatters';
import { Check, CreditCard } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function BillingPage() {
  const { session, loading } = useAuth();
  const router = useRouter();
  const [employeeCount, setEmployeeCount] = useState(0);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && !session) router.push('/login');
    if (!loading && session && session.role !== 'Super Admin') {
      router.push('/restricted');
    }
  }, [session, loading, router]);

  useEffect(() => {
    if (!session) return;
    const fetchCount = async () => {
      setDataLoading(true);
      try {
        const res = await fetch('/api/employees');
        const json = await res.json();
        if (json.success) {
          setEmployeeCount(json.data.length);
        }
      } catch (err) {
        console.error('Failed to load employee count for billing:', err);
      } finally {
        setDataLoading(false);
      }
    };
    fetchCount();
  }, [session]);

  const pricePerUser = 8;
  const monthlyCost = employeeCount * pricePerUser;

  if (loading || !session) {
    return (
      <AppShell>
        <div className="flex items-center justify-center py-32">
          <div
            className="w-8 h-8 rounded-full border-t-transparent"
            style={{
              animation: 'spin 0.6s linear infinite',
              borderWidth: 3,
              borderStyle: 'solid',
              borderColor: 'var(--primary)',
              borderTopColor: 'transparent',
            }}
          />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PageHeader
        title="Billing"
        subtitle="Review subscription, payment methods, invoice histories and upgrade plans."
      />

      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Plan Card */}
          <div className="lg:col-span-2 pc-card p-6 space-y-5">
            <div>
              <p className="text-xs uppercase tracking-wider text-[color:var(--muted-foreground)] font-semibold">
                Current Plan
              </p>
              <h2 className="text-2xl font-bold mt-1 text-[color:var(--primary)]">Growth SaaS</h2>
              <p className="text-sm text-[color:var(--muted-foreground)] mt-1">
                Perfect for growing organizations needing payroll and checklists.
              </p>
            </div>

            <div className="border-t border-b border-[color:var(--border)] py-4 space-y-2">
              <p className="text-sm font-semibold">Included Features:</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-[color:var(--muted-foreground)]">
                {[
                  'Unlimited Payroll Runs',
                  'Unlimited Onboarding Checklists',
                  'Performance Review Cycles',
                  'D3.js Tree Org Chart',
                  'Role-Gated Permissions Map',
                  'Next.js 16 Production Build',
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <Check size={16} className="text-[color:var(--success)] flex-shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button onClick={() => alert('Mocked enterprise subscription checkout.')}>
                Upgrade to Enterprise
              </Button>
              <Button variant="ghost" onClick={() => alert('Mocked stripe checkout integration.')}>
                Manage Payment Details
              </Button>
            </div>
          </div>

          {/* Quick billing summary */}
          <div className="pc-card p-6 flex flex-col justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-[color:var(--muted-foreground)] font-semibold">
                Next Invoice
              </p>
              <h2 className="text-3xl font-extrabold mt-2 text-[color:var(--foreground)]">
                {formatCurrency(monthlyCost)}
              </h2>
              <p className="text-xs text-[color:var(--muted-foreground)] mt-1">
                Based on {employeeCount} active seats at {formatCurrency(pricePerUser)}/user/month
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-[color:var(--border)] flex items-center gap-3">
              <div className="p-2 bg-[color:var(--muted)] rounded-lg">
                <CreditCard size={20} className="text-[color:var(--muted-foreground)]" />
              </div>
              <div className="text-xs text-[color:var(--muted-foreground)]">
                <p className="font-semibold text-[color:var(--foreground)]">Visa ending in 4242</p>
                <p>Expires 12/28</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
