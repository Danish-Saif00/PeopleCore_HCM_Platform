'use client';
import React from 'react';
import { Input } from './Input';

interface DateRangePickerProps {
  fromValue: string;
  toValue: string;
  onFromChange: (val: string) => void;
  onToChange: (val: string) => void;
  fromLabel?: string;
  toLabel?: string;
  fromError?: string;
  toError?: string;
  min?: string;
}

export function DateRangePicker({
  fromValue,
  toValue,
  onFromChange,
  onToChange,
  fromLabel = 'From',
  toLabel = 'To',
  fromError,
  toError,
  min,
}: DateRangePickerProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Input
        type="date"
        label={fromLabel}
        value={fromValue}
        onChange={(e) => onFromChange(e.target.value)}
        error={fromError}
        min={min}
      />
      <Input
        type="date"
        label={toLabel}
        value={toValue}
        onChange={(e) => onToChange(e.target.value)}
        error={toError}
        min={fromValue || min}
      />
    </div>
  );
}
