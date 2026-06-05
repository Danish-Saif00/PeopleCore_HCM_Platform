'use client';
import React, { type ReactNode } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EmptyState } from '@/components/ui/EmptyState';
import { SkeletonMobileList, SkeletonTable } from '@/components/ui/skeleton';

interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  render?: (row: T, idx: number) => ReactNode;
  mobileLabel?: string;
  hideOnMobile?: boolean;
  width?: string;
}

interface DataTableProps<T extends Record<string, unknown>> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  onRowClick?: (row: T) => void;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  onSort?: (key: string) => void;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: ReactNode;
  emptyAction?: ReactNode;
  keyField?: keyof T;
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  loading,
  onRowClick,
  sortBy,
  sortDir,
  onSort,
  emptyTitle = 'No results found',
  emptyDescription,
  emptyIcon,
  emptyAction,
  keyField = 'id' as keyof T,
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div role="status" aria-busy="true" aria-label="Loading table data">
        <span className="sr-only">Loading table data</span>
        <SkeletonTable columns={Math.max(columns.length, 1)} />
        <SkeletonMobileList />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        icon={emptyIcon}
        action={emptyAction}
      />
    );
  }

  return (
    <div aria-busy="false">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="pc-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key} style={{ width: col.width }}>
                  {col.sortable && onSort ? (
                    <button
                      className="flex items-center gap-1 hover:text-[color:var(--foreground)] transition-colors text-left w-full"
                      onClick={() => onSort(col.key)}
                    >
                      {col.header}
                      {sortBy === col.key ? (
                        sortDir === 'asc' ? (
                          <ChevronUp size={12} />
                        ) : (
                          <ChevronDown size={12} />
                        )
                      ) : (
                        <ChevronsUpDown size={12} className="opacity-40" />
                      )}
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr
                key={String(row[keyField] ?? idx)}
                onClick={() => onRowClick?.(row)}
                className={cn(onRowClick && 'clickable')}
              >
                {columns.map((col) => (
                  <td key={col.key}>
                    {col.render ? col.render(row, idx) : String(row[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Stack */}
      <div className="md:hidden space-y-3">
        {data.map((row, idx) => {
          const visibleCols = columns.filter((c) => !c.hideOnMobile);
          const [primaryCol, ...restCols] = visibleCols;
          return (
            <div
              key={String(row[keyField] ?? idx)}
              className={cn(
                'pc-card p-4 transition-colors',
                onRowClick && 'cursor-pointer active:opacity-80'
              )}
              onClick={() => onRowClick?.(row)}
            >
              <div className="mb-3">
                {primaryCol?.render
                  ? primaryCol.render(row, idx)
                  : String(row[primaryCol?.key ?? ''] ?? '')}
              </div>
              <div className="space-y-2">
                {restCols.map((col) => (
                  <div
                    key={col.key}
                    className="flex items-center justify-between gap-2"
                  >
                    <span className="text-xs text-[color:var(--muted-foreground)]">
                      {col.mobileLabel ?? col.header}
                    </span>
                    <span className="text-sm text-[color:var(--foreground)] text-right">
                      {col.render ? col.render(row, idx) : String(row[col.key] ?? '')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
