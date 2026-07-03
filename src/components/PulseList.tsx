import { memo } from 'react';
import { PulseItem } from './PulseItem';
import type { Pulse } from '../types';

interface PulseListProps {
  pulses: Pulse[];
  onToggleRead: (id: string) => void;
}

function PulseListComponent({ pulses, onToggleRead }: PulseListProps) {
  if (pulses.length === 0) {
    return <p style={{ color: '#888', padding: 12 }}>No pulses match your search.</p>;
  }

  return (
    <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
      {pulses.map((pulse) => (
        <PulseItem key={pulse.id} pulse={pulse} onToggleRead={onToggleRead} />
      ))}
    </ul>
  );
}

export const PulseList = memo(PulseListComponent);
