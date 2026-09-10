# Verification record

Verified locally on September 8, 2026, with Node.js v24.19.0 on Windows.

## Automated checks

19 passing tests cover the complete recovery loop, integer-cent amount rendering, exact offer expiration, cap boundaries, hundreds of per-lead cap combinations, SQL constraints, immutable quotes, eligibility exclusions, duplicate cycles, two-touch limits, opt-out precedence, negotiation and prompt-injection routing, pause and quiet-hour behavior, expiration, booking conflicts, transaction rollback, persistence, reset, and HTTP input/origin/shutdown controls.

Run `node --test test/engine.test.mjs test/http.test.mjs test/render.test.mjs` to reproduce.

## Browser checks

- Opened the actual local app and inspected its desktop and 390px mobile layouts.
- Imported a fictional Sam Rivera, sent the $33,150 authorized offer, simulated interest, booked a return appointment, and acknowledged the original-salesperson handoff.
- Confirmed the $1,500 cap challenge is blocked.
- Confirmed a $250 increase is blocked for Cameron Reed's lower $200 limit, with the selected customer and entered amount preserved in the form.
- Verified search, pause/resume, demo navigation, reset confirmation, and restored fixtures.
- Checked the mobile conversation view and document width for horizontal overflow outside the intended scrollable table.
- Observed no browser console errors or warnings during these checks.

## Windows lifecycle

The launcher starts the local server in the background. The stop launcher asks that exact local service to shut down through its checked API, avoiding elevated Windows process enumeration. Start, stop, restart, and retained state were exercised.

Reset was verified to restore the eight original fictional visits, with no customer messages or appointments. Subsequent interaction can add demo leads and activity. The ZIP excludes runtime data and always starts from clean fixtures.

This verifies the prototype. It is not evidence of live integration reliability, legal compliance, production security, actual AI accuracy, or recovered sales.
