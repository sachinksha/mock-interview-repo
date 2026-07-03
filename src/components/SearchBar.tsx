import { useEffect, useRef, useState, type ChangeEvent } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  const [inputValue, setInputValue] = useState(value);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (value !== inputValue) {
      setInputValue(value);
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }
  }, [value]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const nextValue = event.target.value;
    setInputValue(nextValue);

    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      timeoutRef.current = null;
      onChange(nextValue);
    }, 250);
  }

  return (
    <input
      type="text"
      placeholder="Search pulses by author or message…"
      value={inputValue}
      onChange={handleChange}
      style={{ padding: 8, width: '100%', boxSizing: 'border-box' }}
      aria-label="Search pulses"
    />
  );
}
