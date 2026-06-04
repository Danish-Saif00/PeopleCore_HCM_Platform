'use client';
import React, { useEffect, useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { OrgChartD3 } from '@/components/charts/OrgChartD3';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import type { Employee } from '@/types/peoplecore';

export default function OrgChartPage() {
  const { session, loading } = useAuth();
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && !session) router.push('/login');
  }, [session, loading, router]);

  useEffect(() => {
    if (!session) return;
    const fetchEmployees = async () => {
      setDataLoading(true);
      try {
        const res = await fetch('/api/employees');
        const json = await res.json();
        if (json.success) {
          setEmployees(json.data);
        }
      } catch (err) {
        console.error('Failed to fetch org chart employees:', err);
      } finally {
        setDataLoading(false);
      }
    };
    fetchEmployees();
  }, [session]);

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
        title="Organization Chart"
        subtitle="Visualize reporting lines and department reporting trees across the company."
      />

      <div className="pc-card overflow-hidden" style={{ minHeight: '600px' }}>
        {dataLoading ? (
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
        ) : (
          <OrgChartD3 employees={employees} />
        )}
      </div>
    </AppShell>
  );
}
