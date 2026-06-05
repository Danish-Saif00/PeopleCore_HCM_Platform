'use client';
import React, { useEffect, useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { DataTable } from '@/components/tables/DataTable';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/lib/auth-context';
import { Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { Role } from '@/types/peoplecore';

const ROLE_OPTIONS: Role[] = ['Employee', 'Manager', 'HR Admin', 'Super Admin'];

export default function RolesPage() {
  const { session, loading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !session) router.push('/login');
    if (!loading && session && session.role !== 'Super Admin') {
      router.push('/restricted');
    }
  }, [session, loading, router]);

  const fetchUsers = async () => {
    setDataLoading(true);
    try {
      const res = await fetch('/api/roles');
      const json = await res.json();
      if (json.success) {
        setUsers(json.data);
      }
    } catch (err) {
      console.error('Failed to load user roles:', err);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchUsers();
    }
  }, [session]);

  const handleRoleChange = async (employeeId: string, nextRole: Role) => {
    setUpdatingId(employeeId);
    try {
      const res = await fetch('/api/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeId, role: nextRole }),
      });
      const json = await res.json();
      if (json.success) {
        setUsers((prev) =>
          prev.map((u) => (u.employeeId === employeeId ? { ...u, role: nextRole } : u))
        );
      }
    } catch (err) {
      console.error('Failed to update role:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const columns = [
    {
      key: 'fullName',
      header: 'Employee',
      render: (row: any) => (
        <div className="flex items-center gap-3">
          <Avatar name={row.fullName} avatarUrl={row.avatarUrl} size="sm" />
          <span className="font-medium text-[color:var(--foreground)]">{row.fullName}</span>
        </div>
      ),
    },
    {
      key: 'email',
      header: 'Email Address',
    },
    {
      key: 'role',
      header: 'Assigned Role',
      render: (row: any) => (
        <div className="flex items-center gap-2">
          {updatingId === row.employeeId ? (
            <span
              className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full"
              style={{
                animation: 'spin var(--motion-loading-spin) linear infinite',
                color: 'var(--primary)',
              }}
            />
          ) : (
            <select
              className="pc-select h-9 text-xs py-1 w-auto min-w-[150px]"
              value={row.role}
              onChange={(e) => handleRoleChange(row.employeeId, e.target.value as Role)}
              disabled={updatingId !== null}
            >
              {ROLE_OPTIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          )}
        </div>
      ),
    },
  ];

  if (loading || !session) {
    return (
      <AppShell>
        <div className="flex items-center justify-center py-32">
          <div
            className="w-8 h-8 rounded-full border-t-transparent"
            style={{
              animation: 'spin var(--motion-loading-spin) linear infinite',
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
        title="Roles & Access Control"
        subtitle="Manage access scopes and assign roles to company employees."
      />

      <div className="pc-card overflow-hidden">
        <DataTable
          columns={columns as any}
          data={users as any}
          loading={dataLoading}
          emptyTitle="No users found"
          emptyDescription="User list is empty."
        />
      </div>
    </AppShell>
  );
}
