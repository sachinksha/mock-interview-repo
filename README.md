# TeamPulse — Live Coding Round (Mock)

**Time budget: 60 minutes.** Set a timer. Treat this exactly like the real thing —
narrate out loud (to yourself, a rubber duck, or a friend), plan before you prompt,
and use an AI assistant (Claude, ChatGPT, Copilot — whatever you'll actually have
access to) the way you would in the real interview.

## Setup

```
npm install
npm run dev        # runs the app at http://localhost:5173
npm test           # runs the existing test suite (should be green)
```

Open `src/App.tsx` first — that's the entry point that wires everything together.
From there, explore outward.

## Context

TeamPulse is a small internal dashboard that shows a live feed of team status
updates ("pulses") — wins, blockers, and general updates — with a search box,
a type filter, and the ability to mark items as read. The existing test suite
passes. That does not mean the app is bug-free — it means the existing tests
don't happen to cover everything.

## Checkpoint 1 — Find and fix a real bug (≈20 min)

Users have reported that when they type quickly in the search box, the list
sometimes flashes to the wrong results, or briefly shows results for a search
term they've already changed or deleted. It's intermittent and hard to
reproduce by typing slowly, which is part of why it's shipped unnoticed.

**Your task:** find the root cause and fix it. Before you open your AI
assistant, spend a few minutes forming a hypothesis on your own — where would
you look, and why might results arrive out of order in the first place?

Once you have a fix, add a test that would have caught this bug and fails
against the old code. (You can temporarily stash your fix to confirm the test
fails first, then re-apply it — that's a good habit, not busywork.)

## Checkpoint 2 — Finish a half-built feature (≈20 min)

The type filter dropdown (`FilterBar`) is already in the UI and already
reports the selected value up to `App.tsx` — but selecting a type currently
does nothing to the visible list. Wire it up so that:

- Selecting "All types" shows everything (matching the current search query).
- Selecting "Update" / "Blocker" / "Win" narrows the list to that type only.
- The type filter and the search box compose — both should apply together.

Add at least one test covering the new filtering behavior.

## Checkpoint 3 — Stretch goal: performance pass (≈15-20 min, if time allows)

Every keystroke in the search box currently re-renders every row in the list,
even though most rows' content hasn't changed. With this small a list it's not
user-visible, but imagine this list is 500 items long instead of 12.

- Diagnose why the re-renders are happening (React DevTools Profiler, or just
  reasoning about it from the code).
- Fix it.
- Bonus: the search box fires a network request on every keystroke with no
  debounce — is that worth fixing here, and why or why not?

## What "done" looks like

You don't need to finish all three checkpoints to get value out of this — the
point is rehearsing the *process*, not finishing. A good run looks like:

- You read the problem and relevant code before opening the AI chat.
- You can explain, in your own words, every piece of code you accept from the
  AI — including code you didn't write yourself.
- You verify by running the app and/or the tests after each change, not just
  at the end.
- You add tests deliberately, not reflexively — you can say why each one
  exists and what it would catch.
- You're narrating tradeoffs out loud as you go, the way you would with an
  interviewer in the room.

When you're done (or time runs out), open `SOLUTION.md` — but not before.
