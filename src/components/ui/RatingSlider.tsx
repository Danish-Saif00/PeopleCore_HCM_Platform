'use client';
import React from 'react';

interface RatingSliderProps {
  label?: string;
  value: number | null;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
}

export function RatingSlider({
  label,
  value,
  onChange,
  min = 1,
  max = 5,
}: RatingSliderProps) {
  const stars = Array.from({ length: max }, (_, i) => i + 1);
  return (
    <div className="form-group">
      {label && (
        <div className="flex items-center justify-between">
          <label className="form-label">{label}</label>
          {value !== null && (
            <span className="text-lg font-bold text-[color:var(--primary)]">
              {value}
              <span className="text-sm font-normal text-[color:var(--muted-foreground)]">
                /5
              </span>
            </span>
          )}
        </div>
      )}
      <input
        type="range"
        className="rating-slider"
        min={min}
        max={max}
        value={value ?? 1}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          background: value
            ? `linear-gradient(to right, var(--primary) ${((value - min) / (max - min)) * 100}%, var(--border) ${((value - min) / (max - min)) * 100}%)`
            : 'var(--border)',
        }}
      />
      <div className="flex justify-between mt-1">
        {stars.map((n) => (
          <span
            key={n}
            className="text-xs cursor-pointer"
            style={{
              color:
                value && value >= n
                  ? 'var(--primary)'
                  : 'var(--muted-foreground)',
              fontWeight: value === n ? 700 : 400,
            }}
            onClick={() => onChange(n)}
          >
            {n}
          </span>
        ))}
      </div>
      <div className="flex justify-between mt-0.5">
        <span className="text-xs text-[color:var(--muted-foreground)]">
          Needs Improvement
        </span>
        <span className="text-xs text-[color:var(--muted-foreground)]">
          Outstanding
        </span>
      </div>
    </div>
  );
}
