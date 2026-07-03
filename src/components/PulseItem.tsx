import { formatRelativeTime } from '../utils/formatTime';
import type { Pulse } from '../types';

interface PulseItemProps {
  pulse: Pulse;
  onToggleRead: (id: string) => void;
}

const TYPE_LABEL: Record<Pulse['type'], string> = {
  update: 'Update',
  blocker: 'Blocker',
  win: 'Win',
};

export function PulseItem({ pulse, onToggleRead }: PulseItemProps) {
  return (
    <li
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: 12,
        padding: '10px 12px',
        borderBottom: '1px solid #e5e5e5',
        opacity: pulse.read ? 0.6 : 1,
      }}
      data-testid={`pulse-${pulse.id}`}
    >
      <div>
        <strong>{pulse.author}</strong>{' '}
        <span style={{ fontSize: 12, color: '#888' }}>
          [{TYPE_LABEL[pulse.type]}] · {formatRelativeTime(pulse.createdAt)}
        </span>
        <p style={{ margin: '4px 0 0' }}>{pulse.message}</p>
      </div>
      <button onClick={() => onToggleRead(pulse.id)}>
        {pulse.read ? 'Mark unread' : 'Mark read'}
      </button>
    </li>
  );
}
