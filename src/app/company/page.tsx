'use client';
import React, { useEffect, useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/lib/auth-context';
import { formatDate } from '@/lib/formatters';
import { Building2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CompanyPage() {
  const { session, loading } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [country, setCountry] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  const [departments, setDepartments] = useState<any[]>([]);
  const [employeeCount, setEmployeeCount] = useState(0);
  const [dataLoading, setDataLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (!loading && !session) router.push('/login');
    if (!loading && session && session.role !== 'Super Admin') {
      router.push('/restricted');
    }
  }, [session, loading, router]);

  useEffect(() => {
    if (!session) return;
    const fetchCompanyData = async () => {
      setDataLoading(true);
      try {
        const [compRes, empRes] = await Promise.all([
          fetch('/api/company'),
          fetch('/api/employees'),
        ]);
        const compJson = await compRes.json();
        const empJson = await empRes.json();
        
        if (compJson.success) {
          setName(compJson.data.name);
          setSubdomain(compJson.data.subdomain);
          setCountry(compJson.data.country);
          setCreatedAt(compJson.data.createdAt);
        }
        
        if (empJson.success) {
          setEmployeeCount(empJson.data.length);
          // Extract unique departments and count employees in each
          const deptsMap: Record<string, number> = {};
          empJson.data.forEach((e: any) => {
            if (e.department) {
              deptsMap[e.department] = (deptsMap[e.department] || 0) + 1;
            }
          });
          setDepartments(Object.entries(deptsMap).map(([deptName, count]) => ({ name: deptName, count })));
        }
      } catch (err) {
        console.error('Failed to load company settings:', err);
      } finally {
        setDataLoading(false);
      }
    };
    fetchCompanyData();
  }, [session]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setSuccessMsg('');
    try {
      const res = await fetch('/api/company', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, subdomain, country }),
      });
      const json = await res.json();
      if (json.success) {
        setSuccessMsg('Company settings updated successfully.');
      }
    } catch (err) {
      console.error('Failed to update company settings:', err);
    } finally {
      setUpdating(false);
    }
  };

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
        title="Company Settings"
        subtitle="Manage company profile, organization details, and department structures."
      />

      <div className="space-y-6">
        {/* Core Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="pc-card p-5">
            <p className="text-xs uppercase tracking-wider text-[color:var(--muted-foreground)] font-semibold">
              Employees
            </p>
            <p className="text-2xl font-bold mt-1">{employeeCount}</p>
          </div>
          <div className="pc-card p-5">
            <p className="text-xs uppercase tracking-wider text-[color:var(--muted-foreground)] font-semibold">
              Departments
            </p>
            <p className="text-2xl font-bold mt-1">{departments.length}</p>
          </div>
          <div className="pc-card p-5">
            <p className="text-xs uppercase tracking-wider text-[color:var(--muted-foreground)] font-semibold">
              Founded / Seeded
            </p>
            <p className="text-2xl font-bold mt-1">{createdAt ? formatDate(createdAt) : '—'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Edit Form */}
          <div className="lg:col-span-2 pc-card p-6 space-y-4">
            <h3 className="text-base font-semibold border-b border-[color:var(--border)] pb-3">Company Details</h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <Input
                label="Company Name"
                placeholder="e.g. PeopleCore Demo Inc."
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                label="Subdomain"
                placeholder="e.g. demo"
                value={subdomain}
                onChange={(e) => setSubdomain(e.target.value)}
                required
                rightIcon={<span className="text-xs text-[color:var(--muted-foreground)]">.peoplecore.com</span>}
              />
              <Input
                label="Country / HQ Location"
                placeholder="e.g. United States"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
              />
              {successMsg && (
                <p className="text-xs text-[color:var(--success)] font-medium bg-[color:var(--success-soft)] p-3 rounded-xl">
                  {successMsg}
                </p>
              )}
              <Button type="submit" loading={updating} id="save-company-settings">
                Save Changes
              </Button>
            </form>
          </div>

          {/* Departments list */}
          <div className="pc-card p-6">
            <h3 className="text-base font-semibold border-b border-[color:var(--border)] pb-3">Departments</h3>
            <div className="divide-y divide-[color:var(--border)]">
              {departments.map((dept) => (
                <div key={dept.name} className="py-3 flex justify-between text-sm">
                  <span className="font-semibold text-[color:var(--foreground)]">{dept.name}</span>
                  <span className="text-[color:var(--muted-foreground)]">{dept.count} people</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
