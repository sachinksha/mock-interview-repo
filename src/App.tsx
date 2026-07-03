import { useMemo, useState } from 'react';
import { usePulses } from './hooks/usePulses';
import { PulseList } from './components/PulseList';
import { SearchBar } from './components/SearchBar';
import { FilterBar, type TypeFilter } from './components/FilterBar';
import { UnreadBadge } from './components/UnreadBadge';

export function App() {
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');

  const { pulses, status, toggleRead } = usePulses(query);

  const visiblePulses = useMemo(
    () =>
      typeFilter === 'all'
        ? pulses
        : pulses.filter((pulse) => pulse.type === typeFilter),
    [pulses, typeFilter]
  );

  const unreadCount = pulses.filter((p) => !p.read).length;
  // console.log(`Rendering App with query="${query}", typeFilter="${typeFilter}", visiblePulses=${visiblePulses.length}, unreadCount=${unreadCount}`);
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
