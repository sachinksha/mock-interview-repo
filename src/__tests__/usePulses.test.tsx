import { act, renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import * as mockApi from '../api/mockApi';
import { usePulses } from '../hooks/usePulses';
import type { Pulse } from '../types';

describe('usePulses', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

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

  it('aborts the previous request when the query changes before it resolves', async () => {
    let resolveSecond: (value: Pulse[]) => void;
    let rejectFirst: (reason?: any) => void;
    let firstSignal: AbortSignal | undefined;
    let secondSignal: AbortSignal | undefined;

    const fetchMock = vi.spyOn(mockApi, 'fetchPulses').mockImplementation(
      (query: string, delayMs: number | undefined, signal?: AbortSignal) => {
        if (query === 'first') {
          firstSignal = signal;
          return new Promise((_, reject) => {
            rejectFirst = reject;
            signal?.addEventListener(
              'abort',
              () => reject(new DOMException('Aborted', 'AbortError')),
              { once: true }
            );
          });
        }

        secondSignal = signal;
        return new Promise((resolve, reject) => {
          resolveSecond = resolve;
          signal?.addEventListener(
            'abort',
            () => reject(new DOMException('Aborted', 'AbortError')),
            { once: true }
          );
        });
      }
    );

    const { result, rerender } = renderHook(({ query }) => usePulses(query), {
      initialProps: { query: 'first' },
    });

    expect(result.current.status).toBe('loading');

    rerender({ query: 'second' });
    expect(result.current.status).toBe('loading');

    act(() => {
      rejectFirst?.(new DOMException('Aborted', 'AbortError'));
    });

    await act(async () => {
      resolveSecond([
        {
          id: 'second',
          author: 'Test User',
          message: 'second query',
          type: 'update',
          createdAt: new Date().toISOString(),
          read: false,
        },
      ]);
    });

    await waitFor(() => expect(result.current.status).toBe('success'));
    expect(result.current.pulses[0].id).toBe('second');
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(firstSignal?.aborted).toBe(true);
    expect(secondSignal?.aborted).toBe(false);
  });
});
