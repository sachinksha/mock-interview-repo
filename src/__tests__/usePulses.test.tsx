import { renderHook, waitFor } from '@testing-library/react';
import { usePulses } from '../hooks/usePulses';

describe('usePulses', () => {
  it('fetches pulses matching the query', async () => {
    const { result } = renderHook(() => usePulses('onboarding'));

    expect(result.current.status).toBe('loading');

    await waitFor(() => expect(result.current.status).toBe('success'));

    expect(result.current.pulses.length).toBeGreaterThan(0);
    expect(
      result.current.pulses.every(
        (p) =>
          p.message.toLowerCase().includes('onboarding') ||
          p.author.toLowerCase().includes('onboarding')
      )
    ).toBe(true);
  });

  // NOTE: this suite intentionally does not test what happens when `query`
  // changes multiple times in quick succession — see PROBLEM.md checkpoint 1.
});
