import type { Role } from '@/types/peoplecore';

export type Permission =
  | 'view:dashboard'
  | 'view:employees'
  | 'manage:employees'
  | 'view:payroll'
  | 'manage:payroll'
  | 'view:payslips'
  | 'view:time-off'
  | 'manage:time-off'
  | 'approve:time-off'
  | 'view:team'
  | 'view:org-chart'
  | 'view:onboarding'
  | 'manage:onboarding'
  | 'view:reviews'
  | 'manage:reviews'
  | 'submit:reviews'
  | 'view:company'
  | 'manage:company'
  | 'view:billing'
  | 'manage:billing'
  | 'view:roles'
  | 'manage:roles';

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  Guest: [],
  Employee: [
    'view:dashboard',
    'view:payslips',
    'view:time-off',
    'view:org-chart',
    'view:onboarding',
    'view:reviews',
  ],
  Manager: [
    'view:dashboard',
    'view:payslips',
    'view:time-off',
    'manage:time-off',
    'approve:time-off',
    'view:team',
    'view:org-chart',
    'view:onboarding',
    'view:reviews',
    'submit:reviews',
  ],
  'HR Admin': [
    'view:dashboard',
    'view:employees',
    'manage:employees',
    'view:payroll',
    'manage:payroll',
    'view:payslips',
    'view:time-off',
    'manage:time-off',
    'approve:time-off',
    'view:team',
    'view:org-chart',
    'view:onboarding',
    'manage:onboarding',
    'view:reviews',
    'manage:reviews',
    'submit:reviews',
  ],
  'Super Admin': [
    'view:dashboard',
    'view:employees',
    'manage:employees',
    'view:payroll',
    'manage:payroll',
    'view:payslips',
    'view:time-off',
    'manage:time-off',
    'approve:time-off',
    'view:team',
    'view:org-chart',
    'view:onboarding',
    'manage:onboarding',
    'view:reviews',
    'manage:reviews',
    'submit:reviews',
    'view:company',
    'manage:company',
    'view:billing',
    'manage:billing',
    'view:roles',
    'manage:roles',
  ],
};

export const ROUTE_PERMISSIONS: Record<string, Permission> = {
  '/dashboard': 'view:dashboard',
  '/employees': 'view:employees',
  '/payroll': 'view:payroll',
  '/payslips': 'view:payslips',
  '/time-off': 'view:time-off',
  '/team': 'view:team',
  '/org-chart': 'view:org-chart',
  '/onboarding': 'view:onboarding',
  '/reviews': 'view:reviews',
  '/company': 'view:company',
  '/billing': 'view:billing',
  '/roles': 'view:roles',
};

export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function canAccessRoute(role: Role | undefined, path: string): boolean {
  if (!role) return false;
  const requiredPermission = Object.entries(ROUTE_PERMISSIONS).find(
    ([route]) => path.startsWith(route)
  )?.[1];
  if (!requiredPermission) return true;
  return hasPermission(role, requiredPermission);
}

export function getRoleColor(role: string): string {
  const colors: Record<string, string> = {
    'Super Admin': 'pc-badge-danger',
    'HR Admin': 'pc-badge-primary',
    Manager: 'pc-badge-warning',
    Employee: 'pc-badge-success',
    Guest: 'pc-badge-muted',
  };
  return colors[role] ?? 'pc-badge-muted';
}

export function getNavItems(role: Role) {
  const all = [
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: 'LayoutDashboard',
      roles: ['Employee', 'Manager', 'HR Admin', 'Super Admin'],
    },
    {
      href: '/employees',
      label: 'Employees',
      icon: 'Users',
      roles: ['HR Admin', 'Super Admin'],
    },
    {
      href: '/payroll',
      label: 'Payroll',
      icon: 'DollarSign',
      roles: ['HR Admin', 'Super Admin'],
    },
    {
      href: '/payslips',
      label: 'My Payslips',
      icon: 'FileText',
      roles: ['Employee', 'Manager'],
    },
    {
      href: '/time-off',
      label: 'Time Off',
      icon: 'Calendar',
      roles: ['Employee', 'Manager', 'HR Admin', 'Super Admin'],
    },
    {
      href: '/team',
      label: 'My Team',
      icon: 'UserCheck',
      roles: ['Manager', 'Super Admin'],
    },
    {
      href: '/org-chart',
      label: 'Org Chart',
      icon: 'GitBranch',
      roles: ['Employee', 'Manager', 'HR Admin', 'Super Admin'],
    },
    {
      href: '/onboarding',
      label: 'Onboarding',
      icon: 'Clipboard',
      roles: ['Employee', 'Manager', 'HR Admin', 'Super Admin'],
    },
    {
      href: '/reviews',
      label: 'Reviews',
      icon: 'Star',
      roles: ['Employee', 'Manager', 'HR Admin', 'Super Admin'],
    },
    {
      href: '/company',
      label: 'Company',
      icon: 'Building2',
      roles: ['Super Admin'],
    },
    {
      href: '/billing',
      label: 'Billing',
      icon: 'CreditCard',
      roles: ['Super Admin'],
    },
    {
      href: '/roles',
      label: 'Roles',
      icon: 'Shield',
      roles: ['Super Admin'],
    },
  ];
  return all.filter((item) => item.roles.includes(role));
}
