'use client';
import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

interface AddEmployeeModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  departments: { id: string; name: string }[];
}

const EMPLOYMENT_OPTIONS = [
  { value: 'Full-time', label: 'Full-time' },
  { value: 'Part-time', label: 'Part-time' },
  { value: 'Contract', label: 'Contract' },
  { value: 'Intern', label: 'Intern' },
];

const ROLE_OPTIONS = [
  { value: 'Employee', label: 'Employee' },
  { value: 'Manager', label: 'Manager' },
  { value: 'HR Admin', label: 'HR Admin' },
];

export function AddEmployeeModal({
  open,
  onClose,
  onSuccess,
  departments,
}: AddEmployeeModalProps) {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    jobTitle: '',
    department: departments[0]?.name ?? '',
    departmentId: departments[0]?.id ?? '',
    startDate: '',
    baseSalary: '',
    employmentType: 'Full-time',
    role: 'Employee',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const set = (key: string, val: string) =>
    setForm((f) => ({ ...f, [key]: val }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required.';
    if (!form.email.trim()) e.email = 'Email is required.';
    else if (!/^[^@]+@[^@]+\.[^@]+$/.test(form.email))
      e.email = 'Enter a valid email.';
    if (!form.jobTitle.trim()) e.jobTitle = 'Job title is required.';
    if (!form.startDate) e.startDate = 'Start date is required.';
    if (!form.baseSalary || isNaN(Number(form.baseSalary)))
      e.baseSalary = 'Enter a valid salary.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setForm({
          fullName: '',
          email: '',
          phone: '',
          jobTitle: '',
          department: departments[0]?.name ?? '',
          departmentId: departments[0]?.id ?? '',
          startDate: '',
          baseSalary: '',
          employmentType: 'Full-time',
          role: 'Employee',
        });
        setErrors({});
        onSuccess();
        onClose();
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const deptOptions = departments.map((d) => ({ value: d.id, label: d.name }));

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add Employee"
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} loading={loading} id="save-employee">
            Add Employee
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-4">
        <Input
          id="emp-name"
          label="Full Name *"
          value={form.fullName}
          onChange={(e) => set('fullName', e.target.value)}
          error={errors.fullName}
          className="col-span-2"
        />
        <Input
          id="emp-email"
          label="Work Email *"
          type="email"
          value={form.email}
          onChange={(e) => set('email', e.target.value)}
          error={errors.email}
        />
        <Input
          id="emp-phone"
          label="Phone"
          type="tel"
          value={form.phone}
          onChange={(e) => set('phone', e.target.value)}
        />
        <Input
          id="emp-title"
          label="Job Title *"
          value={form.jobTitle}
          onChange={(e) => set('jobTitle', e.target.value)}
          error={errors.jobTitle}
        />
        <Select
          id="emp-dept"
          label="Department"
          options={deptOptions}
          value={form.departmentId}
          onChange={(e) => {
            const dept = departments.find((d) => d.id === e.target.value);
            set('departmentId', e.target.value);
            set('department', dept?.name ?? '');
          }}
        />
        <Input
          id="emp-start"
          label="Start Date *"
          type="date"
          value={form.startDate}
          onChange={(e) => set('startDate', e.target.value)}
          error={errors.startDate}
        />
        <Input
          id="emp-salary"
          label="Base Salary (USD/mo) *"
          type="number"
          value={form.baseSalary}
          onChange={(e) => set('baseSalary', e.target.value)}
          error={errors.baseSalary}
        />
        <Select
          id="emp-type"
          label="Employment Type"
          options={EMPLOYMENT_OPTIONS}
          value={form.employmentType}
          onChange={(e) => set('employmentType', e.target.value)}
        />
        <Select
          id="emp-role"
          label="Role"
          options={ROLE_OPTIONS}
          value={form.role}
          onChange={(e) => set('role', e.target.value)}
        />
      </div>
    </Modal>
  );
}
