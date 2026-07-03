import { useCallback, useEffect, useState } from 'react';
import { fetchPulses } from '../api/mockApi';
import type { FetchStatus, Pulse } from '../types';

/**
 * Fetches pulses matching the given search query and exposes them along
 * with the ability to toggle read/unread state locally.
 */
export function usePulses(query: string) {
  const [pulses, setPulses] = useState<Pulse[]>([]);
  const [status, setStatus] = useState<FetchStatus>('idle');

  useEffect(() => {
    const controller = new AbortController();
    setStatus('loading');

    fetchPulses(query, undefined, controller.signal)
      .then((data) => {
        setPulses(data);
        setStatus('success');
      })
      .catch((error) => {
        // console.error('Error fetching pulses:', error, "query:", query);
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }
        setStatus('error');
      });

    return () => {
      controller.abort();
    };
  }, [query]);

  const toggleRead = useCallback((id: string) => {
    setPulses((prev) =>
      prev.map((p) => (p.id === id ? { ...p, read: !p.read } : p))
    );
  }, []);

  return { pulses, status, toggleRead };
}
