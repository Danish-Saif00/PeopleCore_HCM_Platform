'use client';

import React, { useMemo, useState } from 'react';
import * as d3 from 'd3';

export interface DepartmentDistribution {
  name: string;
  value: number;
}

interface DepartmentDistributionChartProps {
  data: DepartmentDistribution[];
}

const CHART_COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
];

const SIZE = 280;
const OUTER_RADIUS = 112;
const INNER_RADIUS = 70;

export function DepartmentDistributionChart({ data }: DepartmentDistributionChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const total = useMemo(() => data.reduce((sum, item) => sum + item.value, 0), [data]);
  const arcs = useMemo(
    () =>
      d3
        .pie<DepartmentDistribution>()
        .value((item) => item.value)
        .sort(null)
        .padAngle(0.025)(data),
    [data]
  );
  const arc = useMemo(
    () =>
      d3
        .arc<d3.PieArcDatum<DepartmentDistribution>>()
        .innerRadius(INNER_RADIUS)
        .outerRadius(OUTER_RADIUS)
        .cornerRadius(5),
    []
  );
  const active = activeIndex === null ? null : data[activeIndex];
  const activePercentage = active && total > 0 ? Math.round((active.value / total) * 100) : 0;

  if (data.length === 0) {
    return (
      <div className="flex min-h-[300px] items-center justify-center text-sm text-[color:var(--muted-foreground)]">
        No employee distribution data is available.
      </div>
    );
  }

  return (
    <div>
      <div
        className="relative mx-auto w-full max-w-[360px]"
        role="img"
        aria-label={`Employee distribution across ${data.length} departments. ${total} employees total.`}
        onMouseLeave={() => setActiveIndex(null)}
      >
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="h-auto w-full" aria-hidden="true">
          <g transform={`translate(${SIZE / 2}, ${SIZE / 2})`}>
            {arcs.map((item, index) => (
              <path
                key={item.data.name}
                d={arc(item) ?? undefined}
                fill={CHART_COLORS[index % CHART_COLORS.length]}
                opacity={activeIndex === null || activeIndex === index ? 1 : 0.45}
                onMouseEnter={() => setActiveIndex(index)}
                onFocus={() => setActiveIndex(index)}
                onBlur={() => setActiveIndex(null)}
                tabIndex={0}
                className="cursor-pointer outline-none transition-opacity"
              >
                <title>{`${item.data.name}: ${item.data.value} employees`}</title>
              </path>
            ))}
            <text
              textAnchor="middle"
              y="-3"
              fill="var(--foreground)"
              fontSize="30"
              fontWeight="700"
            >
              {total}
            </text>
            <text
              textAnchor="middle"
              y="21"
              fill="var(--muted-foreground)"
              fontSize="12"
              fontWeight="600"
            >
              employees
            </text>
          </g>
        </svg>

        {active && (
          <div className="pointer-events-none absolute left-1/2 top-1/2 min-w-[150px] -translate-x-1/2 translate-y-[76px] rounded-lg border border-[color:var(--border)] bg-[color:var(--card)] px-3 py-2 text-center shadow-md">
            <p className="text-xs font-semibold text-[color:var(--foreground)]">{active.name}</p>
            <p className="mt-0.5 text-xs text-[color:var(--muted-foreground)]">
              {active.value} people · {activePercentage}%
            </p>
          </div>
        )}
      </div>

      <ul className="mt-4 grid gap-2 sm:grid-cols-2" aria-label="Employee distribution legend">
        {data.map((item, index) => (
          <li
            key={item.name}
            className="flex items-center justify-between gap-3 rounded-lg bg-[color:var(--muted)] px-3 py-2 text-xs"
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <span className="flex min-w-0 items-center gap-2">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-sm"
                style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
              />
              <span className="truncate font-medium text-[color:var(--foreground)]">{item.name}</span>
            </span>
            <span className="font-semibold text-[color:var(--muted-foreground)]">{item.value}</span>
          </li>
        ))}
      </ul>

      <p className="sr-only">
        {data.map((item) => `${item.name}: ${item.value} employees.`).join(' ')}
      </p>
    </div>
  );
}
