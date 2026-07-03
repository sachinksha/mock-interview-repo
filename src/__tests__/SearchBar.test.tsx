import { act, fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { SearchBar } from '../components/SearchBar';

describe('SearchBar', () => {
  it('debounces search input changes', async () => {
    const onChange = vi.fn();

    vi.useFakeTimers();
    render(<SearchBar value="" onChange={onChange} />);
    const input = screen.getByRole('textbox', { name: /search pulses/i });

    fireEvent.change(input, { target: { value: 'hi' } });
    expect(onChange).not.toHaveBeenCalled();

    await act(async () => {
      vi.advanceTimersByTime(250);
    });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith('hi');

    vi.useRealTimers();
  });
});
