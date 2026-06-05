'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Download, Mail, Phone, Search, Users } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { StatusBadge } from '@/components/ui/Badge';
import { useAuth } from '@/lib/auth-context';
import { useDebounce } from '@/lib/debounce';
import type { Employee } from '@/types/peoplecore';

const ALL_DEPARTMENTS = 'All departments';

function escapeCsv(value: string): string {
  return `"${value.replaceAll('"', '""')}"`;
}

export default function CompanyDirectoryPage() {
  const { session, loading } = useAuth();
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState(ALL_DEPARTMENTS);
  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    if (!loading && !session) router.push('/login');
  }, [loading, session, router]);

  useEffect(() => {
    if (!session) return;

    const fetchEmployees = async () => {
      setDataLoading(true);
      try {
        const response = await fetch('/api/employees?sortBy=fullName&sortDir=asc');
        const json = await response.json();
        if (json.success) setEmployees(json.data);
      } catch (error) {
        console.error('Failed to load company directory:', error);
      } finally {
        setDataLoading(false);
      }
    };

    fetchEmployees();
  }, [session]);

  const departmentCounts = useMemo(() => {
    const counts = new Map<string, number>();
    employees.forEach((employee) => {
      counts.set(employee.department, (counts.get(employee.department) ?? 0) + 1);
    });
    return [...counts.entries()].sort(([left], [right]) => left.localeCompare(right));
  }, [employees]);

  const visibleEmployees = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase();
    return employees.filter((employee) => {
      const matchesDepartment =
        department === ALL_DEPARTMENTS || employee.department === department;
      const matchesSearch =
        !query ||
        employee.fullName.toLowerCase().includes(query) ||
        employee.jobTitle.toLowerCase().includes(query) ||
        employee.department.toLowerCase().includes(query) ||
        employee.email.toLowerCase().includes(query);
      return matchesDepartment && matchesSearch;
    });
  }, [debouncedSearch, department, employees]);

  const handleExportCsv = () => {
    const headers = ['Name', 'Email', 'Phone', 'Job Title', 'Department', 'Status'];
    const rows = visibleEmployees.map((employee) => [
      employee.fullName,
      employee.email,
      employee.phone,
      employee.jobTitle,
      employee.department,
      employee.status,
    ]);
    const csv = [
      headers.map(escapeCsv).join(','),
      ...rows.map((row) => row.map(escapeCsv).join(',')),
    ].join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'peoplecore-company-directory.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading || !session) {
    return (
      <AppShell>
        <div className="flex items-center justify-center py-32">
          <div
            className="h-8 w-8 rounded-full border-t-transparent"
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
        title="Company Directory"
        subtitle="Find colleagues by name, role, or department."
        action={
          <Button
            variant="secondary"
            icon={<Download size={16} />}
            onClick={handleExportCsv}
            disabled={visibleEmployees.length === 0}
          >
            Export CSV
          </Button>
        }
      />

      <div className="space-y-5">
        <div className="pc-search-field w-full max-w-lg">
          <Search size={15} className="pc-search-icon" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search name, title, department, or email..."
            className="pc-input pc-search-input h-10 w-full text-sm"
            aria-label="Search company directory"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1" aria-label="Filter directory by department">
          <button
            type="button"
            onClick={() => setDepartment(ALL_DEPARTMENTS)}
            aria-pressed={department === ALL_DEPARTMENTS}
            className={`flex shrink-0 items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
              department === ALL_DEPARTMENTS
                ? 'border-[color:var(--primary)] bg-[color:var(--primary-soft)] text-[color:var(--primary)]'
                : 'border-[color:var(--border)] bg-[color:var(--card)] text-[color:var(--foreground)]'
            }`}
          >
            <span className="font-medium">All</span>
            <span className="rounded-full bg-[color:var(--muted)] px-2 py-0.5 text-xs text-[color:var(--muted-foreground)]">
              {employees.length}
            </span>
          </button>
          {departmentCounts.map(([name, count]) => (
            <button
              key={name}
              type="button"
              onClick={() => setDepartment(name)}
              aria-pressed={department === name}
              className={`flex shrink-0 items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
                department === name
                  ? 'border-[color:var(--primary)] bg-[color:var(--primary-soft)] text-[color:var(--primary)]'
                  : 'border-[color:var(--border)] bg-[color:var(--card)] text-[color:var(--foreground)]'
              }`}
            >
              <span className="font-medium">{name}</span>
              <span className="rounded-full bg-[color:var(--muted)] px-2 py-0.5 text-xs text-[color:var(--muted-foreground)]">
                {count}
              </span>
            </button>
          ))}
        </div>

        <p className="text-sm text-[color:var(--muted-foreground)]" aria-live="polite">
          {dataLoading
            ? 'Loading directory...'
            : `${visibleEmployees.length} colleague${visibleEmployees.length === 1 ? '' : 's'} found`}
        </p>

        {dataLoading ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" role="status" aria-label="Loading company directory">
            {Array.from({ length: 8 }, (_, index) => (
              <div key={index} className="pc-card p-5">
                <div className="skeleton mx-auto h-16 w-16 rounded-full" />
                <div className="skeleton mx-auto mt-4 h-4 w-32 rounded" />
                <div className="skeleton mx-auto mt-2 h-3 w-24 rounded" />
                <div className="skeleton mx-auto mt-4 h-6 w-28 rounded" />
              </div>
            ))}
          </div>
        ) : visibleEmployees.length === 0 ? (
          <div className="pc-card">
            <EmptyState
              title="No colleagues found"
              description="Try another search term or select a different department."
              icon={<Users size={32} className="text-[color:var(--muted-foreground)]" />}
              action={
                <Button
                  variant="secondary"
                  onClick={() => {
                    setSearch('');
                    setDepartment(ALL_DEPARTMENTS);
                  }}
                >
                  Clear filters
                </Button>
              }
            />
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visibleEmployees.map((employee) => (
              <article key={employee.id} className="pc-card min-w-0 p-5 text-center">
                <Avatar
                  name={employee.fullName}
                  avatarUrl={employee.avatarUrl}
                  size="xl"
                  className="mx-auto"
                />
                <h2 className="mt-3 truncate text-sm font-semibold text-[color:var(--foreground)]">
                  {employee.fullName}
                </h2>
                <p className="mt-1 truncate text-xs text-[color:var(--muted-foreground)]">
                  {employee.jobTitle}
                </p>
                <div className="mt-3 flex justify-center">
                  <span className="max-w-full truncate rounded-full bg-[color:var(--primary-soft)] px-2.5 py-1 text-[11px] font-medium text-[color:var(--primary)]">
                    {employee.department}
                  </span>
                </div>
                <div className="mt-4 border-t border-[color:var(--border)] pt-3">
                  <StatusBadge status={employee.status} />
                  <div className="mt-3 flex items-center justify-center gap-2">
                    <a
                      href={`mailto:${employee.email}`}
                      className="flex h-10 w-10 items-center justify-center rounded-lg text-[color:var(--muted-foreground)] hover:bg-[color:var(--muted)] hover:text-[color:var(--foreground)]"
                      aria-label={`Email ${employee.fullName}`}
                      title={`Email ${employee.fullName}`}
                    >
                      <Mail size={16} />
                    </a>
                    {employee.phone && (
                      <a
                        href={`tel:${employee.phone}`}
                        className="flex h-10 w-10 items-center justify-center rounded-lg text-[color:var(--muted-foreground)] hover:bg-[color:var(--muted)] hover:text-[color:var(--foreground)]"
                        aria-label={`Call ${employee.fullName}`}
                        title={`Call ${employee.fullName}`}
                      >
                        <Phone size={16} />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
