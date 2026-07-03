import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PulseItem } from '../components/PulseItem';
import type { Pulse } from '../types';

const pulse: Pulse = {
  id: 'p1',
  author: 'Riya Shah',
  message: 'Shipped the new onboarding flow.',
  type: 'win',
  createdAt: new Date().toISOString(),
  read: false,
};

describe('PulseItem', () => {
  it('renders the author and message', () => {
    render(<PulseItem pulse={pulse} onToggleRead={() => {}} />);
    expect(screen.getByText('Riya Shah')).toBeInTheDocument();
    expect(screen.getByText(/Shipped the new onboarding flow/)).toBeInTheDocument();
  });

  it('calls onToggleRead with the pulse id when the button is clicked', async () => {
    const onToggleRead = vi.fn();
    const user = userEvent.setup();

    render(<PulseItem pulse={pulse} onToggleRead={onToggleRead} />);
    await user.click(screen.getByRole('button', { name: /mark read/i }));

    expect(onToggleRead).toHaveBeenCalledWith('p1');
  });
});
