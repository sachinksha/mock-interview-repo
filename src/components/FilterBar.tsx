import type { PulseType } from '../types';

export type TypeFilter = 'all' | PulseType;

interface FilterBarProps {
  value: TypeFilter;
  onChange: (value: TypeFilter) => void;
}

export function FilterBar({ value, onChange }: FilterBarProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as TypeFilter)}
      aria-label="Filter by type"
      style={{ padding: 8 }}
    >
      <option value="all">All types</option>
      <option value="update">Update</option>
      <option value="blocker">Blocker</option>
      <option value="win">Win</option>
    </select>
  );
}

// NOTE: This component only renders the control and reports the selected
// value upward via onChange. Whether that value actually filters the list
// is decided by whoever consumes it (see App.tsx).
