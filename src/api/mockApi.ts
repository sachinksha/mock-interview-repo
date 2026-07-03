import type { Pulse } from '../types';

// Seed data — a small internal "team status update" feed.
const ALL_PULSES: Pulse[] = [
  { id: 'p1', author: 'Riya Shah', message: 'Shipped the new onboarding flow to 10% of traffic.', type: 'win', createdAt: '2026-07-01T09:12:00Z', read: false },
  { id: 'p2', author: 'Marcus Lee', message: 'Blocked on the payments team — waiting for API sandbox access.', type: 'blocker', createdAt: '2026-07-01T10:05:00Z', read: false },
  { id: 'p3', author: 'Sam Okafor', message: 'Refactored the checkout reducer, tests still green.', type: 'update', createdAt: '2026-07-01T11:20:00Z', read: true },
  { id: 'p4', author: 'Priya Nair', message: 'Design review for the new dashboard is done, ship it.', type: 'win', createdAt: '2026-07-01T12:40:00Z', read: false },
  { id: 'p5', author: 'Marcus Lee', message: 'Payments sandbox is up, unblocked now.', type: 'update', createdAt: '2026-07-01T13:15:00Z', read: false },
  { id: 'p6', author: 'Chen Wu', message: 'Staging is down, investigating with infra.', type: 'blocker', createdAt: '2026-07-01T13:50:00Z', read: false },
  { id: 'p7', author: 'Riya Shah', message: 'Onboarding flow at 100% rollout, conversion up 4%.', type: 'win', createdAt: '2026-07-01T14:30:00Z', read: false },
  { id: 'p8', author: 'Sam Okafor', message: 'Weekly perf sync notes are in the doc.', type: 'update', createdAt: '2026-07-01T15:02:00Z', read: true },
  { id: 'p9', author: 'Priya Nair', message: 'Blocked on legal sign-off for the new consent copy.', type: 'blocker', createdAt: '2026-07-01T15:45:00Z', read: false },
  { id: 'p10', author: 'Chen Wu', message: 'Staging restored, root cause was a stale cache node.', type: 'update', createdAt: '2026-07-01T16:10:00Z', read: false },
  { id: 'p11', author: 'Dana Kim', message: 'Migrated the notifications service off the old queue.', type: 'win', createdAt: '2026-07-01T16:40:00Z', read: false },
  { id: 'p12', author: 'Dana Kim', message: 'Blocked on a flaky integration test in CI, digging in.', type: 'blocker', createdAt: '2026-07-01T17:05:00Z', read: false },
];

/**
 * Simulates a real network call, including realistic (and slightly unhelpful)
 * variable latency — short, specific queries tend to resolve faster than
 * broad ones because of how the (fake) search index works. This mirrors a
 * common characteristic of real backends: response time is NOT guaranteed to
 * correlate with request order.
 */
export function fetchPulses(
  query: string,
  delayMs?: number,
  signal?: AbortSignal
): Promise<Pulse[]> {
  // console.log(`fetchPulses called with query="${query}", delayMs=${delayMs}, signal.aborted=${signal?.aborted}`);
  const trimmed = query.trim().toLowerCase();

  const results = trimmed
    ? ALL_PULSES.filter(
        (p) =>
          p.message.toLowerCase().includes(trimmed) ||
          p.author.toLowerCase().includes(trimmed)
      )
    : ALL_PULSES;

  const latency = delayMs ?? (trimmed.length === 0 ? 500 : Math.max(80, 400 - trimmed.length * 40));

  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      // console.log(`fetchPulses aborted immediately for query="${query}"`);
      reject(new DOMException('Aborted', 'AbortError'));
      return;
    }

    // console.log(`fetchPulses will resolve for query="${query}" with ${results.length} results; latency=${latency}ms`);
    const timeoutId = window.setTimeout(() => {
      // console.log(`fetchPulses resolved for query="${query}" with ${results.length} results; latency=${latency}ms`);
      resolve([...results]);
    }, latency);

    const onAbort = () => {
      // console.log(`fetchPulses aborted for query="${query}"`);
      window.clearTimeout(timeoutId);
      reject(new DOMException('Aborted', 'AbortError'));
    };

    signal?.addEventListener('abort', onAbort, { once: true });
  });
}

export function markPulseRead(id: string): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 60));
}
