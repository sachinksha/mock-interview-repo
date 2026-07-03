import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

const mockToggleRead = vi.fn();
const mockPulses = [
  { id: 'p1', author: 'A', message: 'update message', type: 'update', createdAt: '2026-07-01T10:00:00Z', read: false },
  { id: 'p2', author: 'B', message: 'blocker message', type: 'blocker', createdAt: '2026-07-01T11:00:00Z', read: false },
  { id: 'p3', author: 'C', message: 'win message', type: 'win', createdAt: '2026-07-01T12:00:00Z', read: false },
];

vi.mock('../hooks/usePulses', () => ({
  usePulses: vi.fn(() => ({
    pulses: mockPulses,
    status: 'success',
    toggleRead: mockToggleRead,
  })),
}));

import { App } from '../App';

describe('App filter behavior', () => {
  it('filters pulses by selected type and shows all when all is selected', () => {
    render(<App />);

    expect(screen.getByText('update message')).toBeInTheDocument();
    expect(screen.getByText('blocker message')).toBeInTheDocument();
    expect(screen.getByText('win message')).toBeInTheDocument();

    fireEvent.change(screen.getByRole('combobox', { name: /filter by type/i }), {
      target: { value: 'blocker' },
    });

    expect(screen.queryByText('update message')).not.toBeInTheDocument();
    expect(screen.getByText('blocker message')).toBeInTheDocument();
    expect(screen.queryByText('win message')).not.toBeInTheDocument();

    fireEvent.change(screen.getByRole('combobox', { name: /filter by type/i }), {
      target: { value: 'all' },
    });

    expect(screen.getByText('update message')).toBeInTheDocument();
    expect(screen.getByText('blocker message')).toBeInTheDocument();
    expect(screen.getByText('win message')).toBeInTheDocument();
  });
});
