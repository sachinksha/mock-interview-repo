# Solution &amp; Rubric — read only after attempting

## Checkpoint 1 — The bug

**Root cause:** `usePulses` (`src/hooks/usePulses.ts`) fires a new `fetchPulses`
call on every change to `query`, but never checks whether the response it gets
back still corresponds to the *current* query by the time it resolves. The
mock API (`src/api/mockApi.ts`) intentionally has variable latency — shorter,
more specific queries resolve faster than broad ones — which means requests
can resolve **out of order**. If you type `"marcus"` and then quickly delete
it back to `""`, the fast `"marcus"` request can resolve *after* the slow `""`
request, overwriting the correct full list with the stale filtered one.

This is the single most common real-world React data-fetching bug, and it's
exactly the kind of thing a senior/principal candidate is expected to spot
quickly, name precisely (not just "it's a bug, let me try stuff"), and fix
correctly rather than by accident (e.g. adding a debounce alone does **not**
fix this — it just makes the race less likely to occur, not impossible).

**Reference fix — ignore stale responses via an effect-scoped flag:**

```tsx
useEffect(() => {
  let ignore = false;
  setStatus('loading');

  fetchPulses(query)
    .then((data) => {
      if (ignore) return; // a newer effect run has already superseded this one
      setPulses(data);
      setStatus('success');
    })
    .catch(() => {
      if (!ignore) setStatus('error');
    });

  return () => {
    ignore = true;
  };
}, [query]);
```

An `AbortController` passed into `fetchPulses` is an equally valid (and more
"real backend"-realistic) alternative if the candidate reaches for it —
credit either approach. What matters is recognizing *why* the bug happens
(out-of-order resolution, not just "slow network"), not the specific
mechanism used to fix it.

**Reference regression test** (add to `usePulses.test.tsx`):

```tsx
it('ignores a stale response that resolves after a newer one', async () => {
  const { result, rerender } = renderHook(({ q }) => usePulses(q), {
    initialProps: { q: '' },
  });

  // Simulate: broad query starts first and is slow...
  vi.spyOn(mockApi, 'fetchPulses').mockImplementationOnce(
    () => new Promise((resolve) => setTimeout(() => resolve(allPulses), 200))
  );

  rerender({ q: 'marcus' });

  // ...narrow query starts second but resolves first.
  vi.spyOn(mockApi, 'fetchPulses').mockImplementationOnce(
    () => new Promise((resolve) => setTimeout(() => resolve(marcusPulses), 50))
  );

  await waitFor(() => expect(result.current.pulses).toEqual(marcusPulses));

  // Wait past the slow response's resolution time — it should NOT overwrite.
  await new Promise((r) => setTimeout(r, 200));
  expect(result.current.pulses).toEqual(marcusPulses);
});
```

(Exact mocking mechanics will vary — grade the *intent*: proving that a
slow, stale response can't clobber a fresher one.)

## Checkpoint 2 — The feature

**Reference fix**, in `src/App.tsx`:

```tsx
const visiblePulses = pulses.filter(
  (p) => typeFilter === 'all' || p.type === typeFilter
);
```

That's genuinely it — the trap in this checkpoint isn't difficulty, it's
whether the candidate actually reads `FilterBar`'s comment and traces the
existing prop-drilling before writing new code, versus reflexively asking
the AI to "add type filtering" and getting a plausible-looking but
redundant or inconsistent second filtering mechanism (e.g. re-implementing
filtering inside `FilterBar` itself, or filtering inside `usePulses`, both
of which work but fight the codebase's existing separation of "fetch" vs.
"display" concerns).

**What to watch for:** does the candidate compose the type filter with the
existing search query correctly (both apply together), or accidentally let
one override the other?

## Checkpoint 3 — The performance pass

**Diagnosis:** `App` re-renders on every keystroke (because `query` is
state that lives there), which re-renders `PulseList`, which re-renders
every `PulseItem` — even though only the input changed, not the pulses
themselves. Two contributing factors:

1. `PulseItem` isn't memoized, so it re-renders whenever its parent does,
   regardless of whether its own props changed.
2. Even if it were wrapped in `React.memo`, the inline arrow function
   `onToggleRead={onToggleRead}` passed down is stable here (it's not
   recreated inline in `PulseList`) — but if a candidate refactors and
   accidentally introduces an inline `(id) => onToggleRead(id)` wrapper
   somewhere, that would defeat memoization. Worth watching for.

**Reference fix:**

```tsx
// PulseItem.tsx
export const PulseItem = React.memo(function PulseItem({ pulse, onToggleRead }: PulseItemProps) {
  /* ...unchanged... */
});
```

**On the debounce bonus question:** there's no single correct answer — the
strong signal is the reasoning, not the verdict. A good answer notes that
with only 12 items and a mock API, debounce is not user-visibly necessary,
but in the real world reduces redundant network calls and, combined with
the checkpoint-1 fix, reduces the *frequency* of races even though it
doesn't eliminate the need to handle them.

---

## Self-grading rubric

Rate yourself honestly on each — this maps to what real interviewers score:

| Dimension | What "strong" looks like |
|---|---|
| **Problem solving** | Formed a hypothesis before prompting; correctly identified the race condition (not just "network is slow") |
| **Code quality** | Fix matches existing patterns in the codebase; no unrelated refactors along the way |
| **Verification** | Ran the app/tests after each change; added a test that actually fails without the fix |
| **AI collaboration** | Used AI for scoped subtasks, not the whole solution; could explain every line it produced; corrected it when it drifted |
| **Communication** | Narrated the plan and tradeoffs out loud the whole way through, not just at the end |

If checkpoint 1 took you meaningfully longer than 20 minutes, that's useful
signal too — race conditions are exactly the class of bug worth drilling
until spotting them becomes fast.
