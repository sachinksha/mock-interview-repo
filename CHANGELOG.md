# TeamPulse Fixes and Improvements

## Summary
This update fixes the search debounce/abort bug, resolves the filter dropdown regression, and adds targeted tests to verify the new behavior.

## What changed

### 1. Search debounce behavior
- Updated `src/components/SearchBar.tsx` to keep a local input state and debounce calls to `onChange`.
- The input now updates immediately as the user types, while the actual search query is delayed by 250ms.
- Rapid keystrokes cancel the previous debounce timer and only the final value is emitted.

### 2. Abort stale backend requests
- Updated `src/hooks/usePulses.ts` to create an `AbortController` for each query effect.
- The component now aborts the previous fetch request when the query changes.
- Stale fetches are ignored rather than setting error state.

### 3. Abortable API support
- Updated `src/api/mockApi.ts` so `fetchPulses()` accepts an optional `AbortSignal`.
- The fake network timeout is canceled when the signal aborts, and the promise rejects with an `AbortError`.

### 4. Filter dropdown behavior
- Confirmed and preserved `App.tsx` logic so `visiblePulses` is derived from `typeFilter`.
- When `typeFilter === 'all'`, the app renders all pulses.
- Otherwise, the app filters the pulses array by `pulse.type` before passing data to `PulseList`.

### 5. Rendering performance optimization
- Memoized `PulseList` with `React.memo` to avoid rerendering the list when props are unchanged.
- Memoized `PulseItem` with `React.memo` so individual items skip rerendering when their props stay stable.
- Memoized `visiblePulses` in `App.tsx` with `useMemo` so the filtered array is only recomputed when `pulses` or `typeFilter` change.
- Stabilized `toggleRead` in `usePulses.ts` with `useCallback`, giving components a stable callback prop.

## Tests added

### `src/__tests__/SearchBar.test.tsx`
- Verifies that `SearchBar` debounces input changes.
- Confirms `onChange` is not called immediately on keystroke and is called exactly once after the debounce delay.

### `src/__tests__/usePulses.test.tsx`
- Verifies that `usePulses` still fetches pulse data correctly.
- Adds a regression test that changing the query aborts the previous request and only the latest response is applied.

### `src/__tests__/App.test.tsx`
- Adds coverage for filter dropdown behavior when selecting specific pulse types.
- Confirms selecting `all` restores the full pulse list.

## Reasoning behind the fixes

### Why debounce in `SearchBar`?
- Without debounce, each keystroke immediately updated the query and triggered a new backend fetch.
- That caused frequent re-renders and made the app vulnerable to out-of-order responses.
- Debouncing preserves a responsive text input while reducing backend churn.

### Why abort stale fetches?
- The mock API uses asynchronous timeouts and can return responses out of order.
- An earlier request may resolve after a later request and would incorrectly overwrite the latest results.
- Aborting stale requests ensures only the last active query updates `pulses`.

### Why keep filtering in `App.tsx`?
- `typeFilter` is the application-level state for visible content.
- The filter should compose with the current search results and apply after search filtering.
- Passing `visiblePulses` to `PulseList` ensures the rendered list always matches the user-selected filter.

## Verification
- Ran focused tests with `npm test -- src/__tests__/SearchBar.test.tsx src/__tests__/usePulses.test.tsx`.
- Both test files passed successfully.
