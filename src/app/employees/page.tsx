"use client";
import React, { useEffect, useState, useCallback } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { DataTable } from "@/components/tables/DataTable";
import { StatusBadge, Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { AddEmployeeModal } from "@/components/modals/AddEmployeeModal";
import { SidePanel } from "@/components/ui/SidePanel";
import { useAuth } from "@/lib/auth-context";
import { useDebounce } from "@/lib/debounce";
import { formatDate, formatCurrency } from "@/lib/formatters";
import { getRoleColor } from "@/lib/permissions";
import { Plus, Users, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Employee } from "@/types/peoplecore";

const DEPARTMENTS = [
  "All Departments",
  "Executive",
  "Human Resources",
  "Product",
  "Finance",
  "IT",
];
const STATUSES = [
  "All Statuses",
  "Active",
  "Inactive",
  "On Leave",
  "Terminated",
];
const SORT_OPTIONS = [
  { value: "fullName", label: "Sort by Name (A-Z)" },
  { value: "startDate", label: "Sort by Start Date" },
  { value: "department", label: "Sort by Department" },
];

export default function EmployeesPage() {
  const { session, loading } = useAuth();
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<
    { id: string; name: string }[]
  >([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");
  const [status, setStatus] = useState("All");
  const [sortBy, setSortBy] = useState("fullName");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );

  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    if (!loading && !session) router.push("/login");
    if (
      !loading &&
      session &&
      !["HR Admin", "Super Admin"].includes(session.role)
    )
      router.push("/restricted");
  }, [session, loading, router]);

  const fetchEmployees = useCallback(async () => {
    setDataLoading(true);
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (department !== "All") params.set("department", department);
    if (status !== "All") params.set("status", status);
    params.set("sortBy", sortBy);
    params.set("sortDir", sortDir);
    try {
      const res = await fetch(`/api/employees?${params.toString()}`);
      const data = await res.json();
      if (data.success) setEmployees(data.data);
    } catch (err) {
      console.error("Failed to fetch employees:", err);
    }
    setDataLoading(false);
  }, [debouncedSearch, department, status, sortBy, sortDir]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  useEffect(() => {
    setDepartments([
      { id: "dept_exec", name: "Executive" },
      { id: "dept_hr", name: "Human Resources" },
      { id: "dept_product", name: "Product" },
      { id: "dept_finance", name: "Finance" },
      { id: "dept_it", name: "IT" },
    ]);
  }, []);

  const handleSort = (key: string) => {
    if (sortBy === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortBy(key);
      setSortDir("asc");
    }
  };

  const columns = [
    {
      key: "fullName",
      header: "Employee",
      sortable: true,
      render: (row: Employee) => (
        <div className="flex items-center gap-3">
          <Avatar name={row.fullName} avatarUrl={row.avatarUrl} size="sm" />
          <div>
            <p className="font-medium text-[color:var(--foreground)]">
              {row.fullName}
            </p>
            <p className="text-xs text-[color:var(--muted-foreground)]">
              {row.email}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "jobTitle",
      header: "Job Title",
      sortable: false,
    },
    {
      key: "department",
      header: "Department",
      sortable: true,
    },
    {
      key: "employmentType",
      header: "Type",
      hideOnMobile: true,
      render: (row: Employee) => (
        <Badge variant="primary">{row.employmentType}</Badge>
      ),
    },
    {
      key: "startDate",
      header: "Start Date",
      sortable: true,
      hideOnMobile: true,
      render: (row: Employee) => formatDate(row.startDate),
    },
    {
      key: "status",
      header: "Status",
      render: (row: Employee) => <StatusBadge status={row.status} />,
    },
    {
      key: "role",
      header: "Role",
      hideOnMobile: true,
      render: (row: Employee) => {
        const colorClass = getRoleColor(row.role).replace("pc-badge-", "") as
          | "primary"
          | "success"
          | "warning"
          | "danger"
          | "muted"
          | "info";
        return <Badge variant={colorClass}>{row.role}</Badge>;
      },
    },
  ];

  if (loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center py-32">
          <div
            className="w-8 h-8 rounded-full border-t-transparent"
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
      <PageHeader
        title="Employees"
        subtitle={`${employees.length} total employee${employees.length !== 1 ? "s" : ""}`}
        action={
          <Button
            icon={<Plus size={16} />}
            onClick={() => setShowAddModal(true)}
            id="add-employee"
          >
            Add Employee
          </Button>
        }
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="pc-search-field flex-1 min-w-[200px]">
          <Search size={14} className="pc-search-icon" />
          <input
            type="search"
            placeholder="Search employees..."
            className="pc-input pc-search-input h-9 text-sm w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            id="employee-search"
          />
        </div>
        <select
          className="pc-select h-9 text-sm w-auto min-w-[140px]"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          id="filter-department"
        >
          {DEPARTMENTS.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
        <select
          className="pc-select h-9 text-sm w-auto min-w-[120px]"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          id="filter-status"
        >
          {STATUSES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <select
          className="pc-select h-9 text-sm w-auto min-w-[140px]"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          id="sort-employees"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div className="pc-card overflow-hidden">
        <DataTable
          columns={columns as any}
          data={employees as any}
          loading={dataLoading}
          onRowClick={(row) => setSelectedEmployee(row as unknown as Employee)}
          sortBy={sortBy}
          sortDir={sortDir}
          onSort={handleSort}
          emptyTitle="No employees found"
          emptyDescription="Add your first employee to get started."
          emptyIcon={<Users size={32} />}
          emptyAction={
            <Button
              onClick={() => setShowAddModal(true)}
              icon={<Plus size={16} />}
            >
              Add Employee
            </Button>
          }
        />
      </div>

      <AddEmployeeModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={fetchEmployees}
        departments={departments}
      />

      {/* Employee profile side panel */}
      {selectedEmployee && (
        <SidePanel
          open={!!selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
          title={selectedEmployee.fullName}
          subtitle={selectedEmployee.jobTitle}
        >
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <Avatar
                name={selectedEmployee.fullName}
                avatarUrl={selectedEmployee.avatarUrl}
                size="xl"
              />
              <div>
                <p className="font-semibold text-lg">
                  {selectedEmployee.fullName}
                </p>
                <p className="text-sm text-[color:var(--muted-foreground)]">
                  {selectedEmployee.jobTitle}
                </p>
                <div className="mt-1">
                  <StatusBadge status={selectedEmployee.status} />
                </div>
              </div>
            </div>

            <div className="space-y-0">
              {[
                { label: "Email", value: selectedEmployee.email },
                { label: "Phone", value: selectedEmployee.phone || "N/A" },
                { label: "Department", value: selectedEmployee.department },
                {
                  label: "Employment Type",
                  value: selectedEmployee.employmentType,
                },
                {
                  label: "Start Date",
                  value: formatDate(selectedEmployee.startDate),
                },
                {
                  label: "Base Salary",
                  value: formatCurrency(selectedEmployee.baseSalary) + "/mo",
                },
                { label: "Role", value: selectedEmployee.role },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex justify-between py-3 border-b border-[color:var(--border)] last:border-0"
                >
                  <span className="text-sm text-[color:var(--muted-foreground)]">
                    {item.label}
                  </span>
                  <span className="text-sm font-medium text-right">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </SidePanel>
      )}
    </AppShell>
  );
}
