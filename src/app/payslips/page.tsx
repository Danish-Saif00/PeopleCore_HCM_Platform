"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Download, FileText, Printer, Search } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton, SkeletonCardGrid } from "@/components/ui/skeleton";
import { PayslipSidePanel } from "@/components/side-panels/PayslipSidePanel";
import { NetPayProgressionChart } from "@/components/charts/NetPayProgressionChart";
import { useAuth } from "@/lib/auth-context";
import { useDebounce } from "@/lib/debounce";
import { formatCurrency } from "@/lib/formatters";
import type { Employee, Payslip } from "@/types/peoplecore";

function totalDeductions(payslip: Payslip): number {
  return Object.values(payslip.deductions).reduce(
    (sum, value) => sum + (value ?? 0),
    0,
  );
}

function monthTimestamp(month: string): number {
  const parsed = Date.parse(`1 ${month}`);
  return Number.isNaN(parsed) ? 0 : parsed;
}

export default function PayslipsPage() {
  const { session, loading } = useAuth();
  const router = useRouter();
  const [slips, setSlips] = useState<Payslip[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [dataLoading, setDataLoading] = useState(true);
  const [employeesLoading, setEmployeesLoading] = useState(false);
  const [selectedSlip, setSelectedSlip] = useState<Payslip | null>(null);
  const debouncedEmployeeSearch = useDebounce(employeeSearch);

  const isAdmin = session
    ? ["HR Admin", "Super Admin"].includes(session.role)
    : false;

  useEffect(() => {
    if (!loading && !session) router.push("/login");
  }, [session, loading, router]);

  useEffect(() => {
    if (!session) return;
    setSelectedEmployeeId(session.employeeId);
  }, [session]);

  useEffect(() => {
    if (!session || !isAdmin) return;

    const fetchEmployees = async () => {
      setEmployeesLoading(true);
      try {
        const response = await fetch(
          "/api/employees?sortBy=fullName&sortDir=asc",
        );
        const json = await response.json();
        if (json.success) setEmployees(json.data);
      } catch (error) {
        console.error(
          "Failed to fetch employees for payslip selection:",
          error,
        );
      } finally {
        setEmployeesLoading(false);
      }
    };

    fetchEmployees();
  }, [isAdmin, session]);

  const fetchSlips = useCallback(async () => {
    if (!session || !selectedEmployeeId) return;

    setDataLoading(true);
    setSelectedSlip(null);
    try {
      const query = isAdmin
        ? `?employeeId=${encodeURIComponent(selectedEmployeeId)}`
        : "";
      const response = await fetch(`/api/payslips${query}`);
      const json = await response.json();
      if (json.success) setSlips(json.data);
    } catch (error) {
      console.error("Failed to fetch employee payslips:", error);
    } finally {
      setDataLoading(false);
    }
  }, [isAdmin, selectedEmployeeId, session]);

  useEffect(() => {
    fetchSlips();
  }, [fetchSlips]);

  const selectedEmployee = useMemo(
    () => employees.find((employee) => employee.id === selectedEmployeeId),
    [employees, selectedEmployeeId],
  );
  const selectedEmployeeName =
    selectedEmployee?.fullName ??
    session?.fullName ??
    session?.email ??
    "Employee";
  const newestFirst = useMemo(
    () =>
      [...slips].sort(
        (left, right) =>
          monthTimestamp(right.month) - monthTimestamp(left.month),
      ),
    [slips],
  );
  const filteredEmployees = useMemo(() => {
    const query = debouncedEmployeeSearch.trim().toLowerCase();
    if (!query) return employees;
    return employees.filter(
      (employee) =>
        employee.fullName.toLowerCase().includes(query) ||
        employee.jobTitle.toLowerCase().includes(query) ||
        employee.department.toLowerCase().includes(query) ||
        employee.email.toLowerCase().includes(query),
    );
  }, [debouncedEmployeeSearch, employees]);
  const selectorEmployees = useMemo(() => {
    const current = employees.find(
      (employee) => employee.id === selectedEmployeeId,
    );
    if (
      !current ||
      filteredEmployees.some((employee) => employee.id === current.id)
    ) {
      return filteredEmployees;
    }
    return [current, ...filteredEmployees];
  }, [employees, filteredEmployees, selectedEmployeeId]);

  const handleMockDownload = (payslip: Payslip) => {
    alert(
      `Mocked PDF download for payslip ${payslip.id}. In production, this would generate a real PDF.`,
    );
  };

  if (loading || !session) {
    return (
      <AppShell>
        <div className="flex items-center justify-center py-32">
          <div
            className="h-8 w-8 rounded-full border-t-transparent"
            style={{
              animation: "spin var(--motion-loading-spin) linear infinite",
              borderWidth: 3,
              borderStyle: "solid",
              borderColor: "var(--primary)",
              borderTopColor: "transparent",
            }}
          />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="payslips-print-root">
        <PageHeader
          title="My Payslips"
          subtitle="Review earnings history, pay progression, and detailed deductions."
        />

        {isAdmin && (
          <section className="payslips-print-hidden mb-6 pc-card p-5">
            <div className="mb-4">
              <h2 className="card-title">Employee Payslip View</h2>
              <p className="mt-1 text-xs text-[color:var(--muted-foreground)]">
                Select an employee to review their payslip history.
              </p>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="pc-search-field">
                <Search size={15} className="pc-search-icon" />
                <input
                  type="search"
                  value={employeeSearch}
                  onChange={(event) => setEmployeeSearch(event.target.value)}
                  placeholder="Search employees..."
                  className="pc-input pc-search-input h-10 w-full text-sm"
                  aria-label="Search employees for payslips"
                />
              </div>
              <select
                className="pc-select h-10 w-full text-sm"
                value={selectedEmployeeId}
                onChange={(event) => setSelectedEmployeeId(event.target.value)}
                disabled={employeesLoading}
                aria-label="Select employee payslip history"
              >
                {selectorEmployees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.fullName} - {employee.jobTitle}
                  </option>
                ))}
              </select>
            </div>
          </section>
        )}

        <div className="space-y-6">
          <section className="payslips-print-hidden pc-card p-5">
            <div className="mb-4">
              <h2 className="card-title">Net Pay Progression</h2>
              <p className="mt-1 text-xs text-[color:var(--muted-foreground)]">
                {selectedEmployeeName}&apos;s net pay across issued payslips.
              </p>
            </div>
            {dataLoading ? (
              <Skeleton
                className="mx-auto h-[270px] w-full max-w-[960px] sm:h-[290px] md:h-[320px]"
                rounded="lg"
              />
            ) : (
              <NetPayProgressionChart payslips={slips} />
            )}
          </section>

          <section aria-labelledby="payslip-history-title">
            <div className="mb-4">
              <h2 id="payslip-history-title" className="card-title">
                Payslip History
              </h2>
              <p className="mt-1 text-xs text-[color:var(--muted-foreground)]">
                Newest issued payslips appear first.
              </p>
            </div>

            {dataLoading ? (
              <SkeletonCardGrid
                count={3}
                className="sm:grid-cols-2 lg:grid-cols-3"
              />
            ) : newestFirst.length === 0 ? (
              <div className="pc-card">
                <EmptyState
                  title="No payslips available yet"
                  description="Payslips will appear here after payroll is processed."
                  icon={
                    <FileText
                      size={32}
                      className="text-[color:var(--muted-foreground)]"
                    />
                  }
                />
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {newestFirst.map((payslip) => (
                  <article
                    key={payslip.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedSlip(payslip)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setSelectedSlip(payslip);
                      }
                    }}
                    className="pc-card cursor-pointer p-5 outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)]"
                    aria-label={`Open ${payslip.month} payslip for ${selectedEmployeeName}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold text-[color:var(--foreground)]">
                          {payslip.month}
                        </p>
                        <p className="mt-1 truncate text-xs text-[color:var(--muted-foreground)]">
                          {selectedEmployeeName}
                        </p>
                      </div>
                      <div className="payslips-print-hidden flex shrink-0 gap-1">
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            window.print();
                          }}
                          className="flex h-10 w-10 items-center justify-center rounded-lg text-[color:var(--muted-foreground)] hover:bg-[color:var(--muted)] hover:text-[color:var(--foreground)]"
                          aria-label={`Print ${payslip.month} payslip`}
                          title="Print payslip"
                        >
                          <Printer size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleMockDownload(payslip);
                          }}
                          className="flex h-10 w-10 items-center justify-center rounded-lg text-[color:var(--muted-foreground)] hover:bg-[color:var(--muted)] hover:text-[color:var(--foreground)]"
                          aria-label={`Download ${payslip.month} payslip`}
                          title="Download payslip"
                        >
                          <Download size={16} />
                        </button>
                      </div>
                    </div>

                    <dl className="mt-4 space-y-2 rounded-lg bg-[color:var(--muted)] p-3 text-sm">
                      <div className="flex items-center justify-between gap-4">
                        <dt className="text-[color:var(--muted-foreground)]">
                          Gross Pay
                        </dt>
                        <dd className="font-mono font-medium">
                          {formatCurrency(payslip.grossPay)}
                        </dd>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <dt className="text-[color:var(--muted-foreground)]">
                          Deductions
                        </dt>
                        <dd className="font-mono font-medium text-[color:var(--danger)]">
                          -{formatCurrency(totalDeductions(payslip))}
                        </dd>
                      </div>
                      <div className="flex items-center justify-between gap-4 border-t border-[color:var(--border)] pt-2">
                        <dt className="font-semibold text-[color:var(--foreground)]">
                          Net Pay
                        </dt>
                        <dd className="font-mono font-bold text-[color:var(--success)]">
                          {formatCurrency(payslip.netPay)}
                        </dd>
                      </div>
                    </dl>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>

        <PayslipSidePanel
          payslip={selectedSlip}
          employeeName={selectedEmployeeName}
          open={!!selectedSlip}
          onClose={() => setSelectedSlip(null)}
        />
      </div>
    </AppShell>
  );
}
