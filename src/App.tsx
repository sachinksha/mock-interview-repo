import { useState } from 'react';
import { usePulses } from './hooks/usePulses';
import { PulseList } from './components/PulseList';
import { SearchBar } from './components/SearchBar';
import { FilterBar, type TypeFilter } from './components/FilterBar';
import { UnreadBadge } from './components/UnreadBadge';

export function App() {
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');

  const { pulses, status, toggleRead } = usePulses(query);

  // TODO(checkpoint 2): `typeFilter` is tracked above and the dropdown in
  // FilterBar already reports the selected value here — but it's never
  // actually applied to `pulses` before rendering. Wire it up so selecting
  // a type in the dropdown filters the visible list.
  const visiblePulses = pulses;

  const unreadCount = pulses.filter((p) => !p.read).length;

  return (
    <div style={{ maxWidth: 640, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <h1 style={{ fontSize: 20, margin: 0 }}>TeamPulse</h1>
        <UnreadBadge count={unreadCount} />
      </header>

      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <SearchBar value={query} onChange={setQuery} />
        <FilterBar value={typeFilter} onChange={setTypeFilter} />
      </div>

      {status === 'loading' && <p style={{ color: '#888' }}>Loading…</p>}
      {status === 'error' && <p style={{ color: '#d64545' }}>Something went wrong.</p>}

      <PulseList pulses={visiblePulses} onToggleRead={toggleRead} />
    </div>
  );
}
