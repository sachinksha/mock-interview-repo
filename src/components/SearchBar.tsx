interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <input
      type="text"
      placeholder="Search pulses by author or message…"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{ padding: 8, width: '100%', boxSizing: 'border-box' }}
      aria-label="Search pulses"
    />
  );
}
