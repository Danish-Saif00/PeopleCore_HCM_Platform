import React, { type ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  breadcrumb?: string[];
}

export function PageHeader({ title, subtitle, action, breadcrumb }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
      <div>
        {breadcrumb && breadcrumb.length > 0 && (
          <p className="text-xs text-[color:var(--muted-foreground)] mb-1">
            {breadcrumb.map((crumb, i) => (
              <span key={i}>
                {i > 0 && <span className="mx-1">/</span>}
                {crumb}
              </span>
            ))}
          </p>
        )}
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="text-sm text-[color:var(--muted-foreground)] mt-1">{subtitle}</p>}
      </div>
      {action && <div className="flex items-center gap-3 w-full sm:w-auto [&_.pc-btn]:w-full sm:[&_.pc-btn]:w-auto">{action}</div>}
    </div>
  );
}
