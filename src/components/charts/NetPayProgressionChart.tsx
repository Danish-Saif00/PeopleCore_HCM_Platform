'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as d3 from 'd3';
import { formatCurrency } from '@/lib/formatters';
import type { Payslip } from '@/types/peoplecore';

interface NetPayProgressionChartProps {
  payslips: Payslip[];
}

interface ChartSize {
  width: number;
  height: number;
}

interface TooltipPosition {
  x: number;
  y: number;
}

const MAX_CHART_WIDTH = 960;
const DEFAULT_SIZE = { width: 760, height: 300 };

function chartHeight(width: number): number {
  if (width < 480) return 270;
  if (width < 768) return 290;
  return 320;
}

function monthTimestamp(month: string): number {
  const parsed = Date.parse(`1 ${month}`);
  return Number.isNaN(parsed) ? 0 : parsed;
}

export function NetPayProgressionChart({ payslips }: NetPayProgressionChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<ChartSize>(DEFAULT_SIZE);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<TooltipPosition | null>(null);
  const data = useMemo(
    () => [...payslips].sort((left, right) => monthTimestamp(left.month) - monthTimestamp(right.month)),
    [payslips]
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateSize = () => {
      const width = Math.min(container.clientWidth, MAX_CHART_WIDTH);
      setSize((current) => {
        const next = { width, height: chartHeight(width) };
        return current.width === next.width && current.height === next.height ? current : next;
      });
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const chart = useMemo(() => {
    if (data.length === 0) return null;

    const compact = size.width < 520;
    const margin = compact
      ? { top: 20, right: 12, bottom: 42, left: 54 }
      : { top: 24, right: 24, bottom: 48, left: 68 };
    const minPay = d3.min(data, (item) => item.netPay) ?? 0;
    const maxPay = d3.max(data, (item) => item.netPay) ?? 0;
    const padding = Math.max((maxPay - minPay) * 0.25, maxPay * 0.08, 100);
    const x = d3
      .scalePoint<string>()
      .domain(data.map((item) => item.month))
      .range([margin.left, size.width - margin.right])
      .padding(data.length === 1 ? 0.5 : compact ? 0.1 : 0.2);
    const y = d3
      .scaleLinear()
      .domain([Math.max(0, minPay - padding), maxPay + padding])
      .nice()
      .range([size.height - margin.bottom, margin.top]);
    const line = d3
      .line<Payslip>()
      .x((item) => x(item.month) ?? margin.left)
      .y((item) => y(item.netPay))
      .curve(d3.curveMonotoneX);

    return {
      x,
      y,
      linePath: line(data) ?? '',
      yTicks: y.ticks(4),
      margin,
      compact,
    };
  }, [data, size]);
  const active = activeIndex === null ? null : data[activeIndex];

  if (!chart) {
    return (
      <div className="mx-auto flex h-[270px] w-full max-w-[960px] items-center justify-center text-sm text-[color:var(--muted-foreground)] sm:h-[290px] md:h-[320px]">
        Net-pay progression will appear after the first payslip is issued.
      </div>
    );
  }

  const showTooltipAtPoint = (index: number) => {
    const item = data[index];
    setActiveIndex(index);
    setTooltipPosition({
      x: chart.x(item.month) ?? chart.margin.left,
      y: chart.y(item.netPay),
    });
  };

  const updateTooltipFromPointer = (event: React.PointerEvent<SVGCircleElement>, index: number) => {
    const bounds = containerRef.current?.getBoundingClientRect();
    if (!bounds) return;
    setActiveIndex(index);
    setTooltipPosition({
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
    });
  };

  const tooltipOnRight = tooltipPosition ? tooltipPosition.x + 168 <= size.width : true;
  const tooltipBelow = tooltipPosition ? tooltipPosition.y < 76 : false;

  return (
    <div
      ref={containerRef}
      className="relative mx-auto h-[270px] w-full max-w-[960px] sm:h-[290px] md:h-[320px]"
      role="img"
      aria-label={`Net pay progression across ${data.length} payslip${data.length === 1 ? '' : 's'}.`}
      onPointerLeave={() => {
        setActiveIndex(null);
        setTooltipPosition(null);
      }}
    >
      <svg
        viewBox={`0 0 ${size.width} ${size.height}`}
        className="block h-full w-full"
        aria-hidden="true"
      >
        {chart.yTicks.map((tick) => (
          <g key={tick}>
            <line
              x1={chart.margin.left}
              x2={size.width - chart.margin.right}
              y1={chart.y(tick)}
              y2={chart.y(tick)}
              stroke="var(--border)"
              strokeDasharray="4 4"
              className="transition-colors duration-300"
            />
            <text
              x={chart.margin.left - 10}
              y={chart.y(tick) + 4}
              textAnchor="end"
              fill="var(--muted-foreground)"
              fontSize={chart.compact ? 9 : 11}
            >
              {formatCurrency(tick)}
            </text>
          </g>
        ))}
        <line
          x1={chart.margin.left}
          x2={size.width - chart.margin.right}
          y1={size.height - chart.margin.bottom}
          y2={size.height - chart.margin.bottom}
          stroke="var(--border)"
          className="transition-colors duration-300"
        />
        <path
          d={chart.linePath}
          fill="none"
          stroke="var(--chart-1)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-all duration-500 ease-out"
        />
        {data.map((item, index) => {
          const x = chart.x(item.month) ?? chart.margin.left;
          const y = chart.y(item.netPay);
          const activePoint = activeIndex === index;
          return (
            <g key={item.id}>
              <circle
                cx={x}
                cy={y}
                r={activePoint ? 7 : 5}
                fill="var(--card)"
                stroke="var(--chart-1)"
                strokeWidth="3"
                tabIndex={0}
                className="cursor-pointer outline-none transition-all duration-300 ease-out"
                onPointerEnter={(event) => updateTooltipFromPointer(event, index)}
                onPointerMove={(event) => updateTooltipFromPointer(event, index)}
                onFocus={() => showTooltipAtPoint(index)}
                onBlur={() => {
                  setActiveIndex(null);
                  setTooltipPosition(null);
                }}
              >
                <title>{`${item.month}: ${formatCurrency(item.netPay)} net pay`}</title>
              </circle>
              <text
                x={x}
                y={size.height - chart.margin.bottom + 24}
                textAnchor="middle"
                fill="var(--muted-foreground)"
                fontSize={chart.compact ? 10 : 11}
              >
                {item.month}
              </text>
            </g>
          );
        })}
      </svg>

      {active && tooltipPosition && (
        <div
          className="pointer-events-none absolute z-10 min-w-36 rounded-lg border border-[color:var(--border)] bg-[color:var(--card)] px-3 py-2 shadow-md transition-[opacity,transform] duration-200 ease-out"
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y,
            transform: `translate(${tooltipOnRight ? '12px' : 'calc(-100% - 12px)'}, ${
              tooltipBelow ? '12px' : 'calc(-100% - 12px)'
            })`,
          }}
        >
          <p className="text-xs font-semibold text-[color:var(--foreground)]">{active.month}</p>
          <p className="mt-0.5 text-xs text-[color:var(--muted-foreground)]">
            Net pay: {formatCurrency(active.netPay)}
          </p>
        </div>
      )}

      <p className="sr-only">
        {data.map((item) => `${item.month}: ${formatCurrency(item.netPay)} net pay.`).join(' ')}
      </p>
    </div>
  );
}
