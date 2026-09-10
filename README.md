# Returnlane

## Railway deployment

The application is ready for Railway's Node runtime. Railway can use the package `start` script automatically. In production, the server listens on Railway's `PORT` and accepts the public service hostname. Local development remains bound to `127.0.0.1:4317`.

The SQLite demo database is created at runtime. Attach a Railway volume mounted at `/app/data` if demo activity should survive deployments and restarts.

A local, end-to-end demonstration of dealership trade-in recovery. Built for a GM conversation: a cold showroom visit becomes a controlled follow-up, an interested customer, and a return appointment owned by the original salesperson.

## Open the demo

Double-click **Start Demo.cmd** in this folder. The app opens at **http://127.0.0.1:4317**. Double-click **Stop Demo.cmd** to stop the background server started by this launcher. Your demo data is retained.

Requires Node.js 24 or newer. The Windows launcher also detects the bundled Node runtime on this computer. No package installation, API key, internet access, or paid service is required. If Windows prevents the launcher from running, open a terminal in this folder and run:

```text
node server.mjs
```

Leave that terminal open; Ctrl+C stops it. For a different local port, set `RETURNLANE_PORT` before running the server directly. The desktop launcher uses port 4317.

## Present it in three minutes

1. Click **Start guided demo**. A fictional Sam Rivera is imported with a $32,900 original appraisal and Jordan Ellis as salesperson.
2. Click **Simulate first follow-up**. The actual policy engine authorizes $33,150: a $250 increase. Read the controlled message and conditions.
3. Click **I’m interested**. A handoff is created for Jordan, carrying the customer context.
4. Choose a return-visit slot. The simulated calendar reserves it; the conversation and handoff update together.
5. Click **Simulate salesperson accepting handoff**. Open Salesperson handoffs to see the next action.
6. Open **Offer safeguards** and test a $1,500 increase. The real server rejects it. This test cannot change or send an offer.

For an objection demo, start a second guided lead and choose **Ask for $2,000 more**. The system routes the negotiation to Jordan and leaves the quote untouched. Choose **Opt out** to show immediate suppression, then try another interested reply: automation cannot reactivate contact.

Use **Demo guide → Advance 48 hours**, then **Run recovery cycle**, to demonstrate the single reminder at the same offer. A second advance and cycle cannot produce a third touch. The clock starts Tuesday, September 8, 2026, at 10:15am Eastern and only moves when you advance it. Appraisal expiration and contact windows use this clock, not your computer clock.

**Reset demo** is inside Demo guide and asks before clearing fictional conversations, appointments, and the activity record. Export the audit first to retain a presentation run. Reset restores the initial eight visits.

## What is real, and what is simulated

| Working implementation | Explicit simulation |
| --- | --- |
| Local HTTP server and persistent SQLite database | Dealership CRM import (fixed fictional fixtures) |
| Integer-cent offer policy and database constraints | AI intent classification (conservative deterministic rules) |
| Controlled outbound message renderer | SMS transport and customer replies (in-app inbox only) |
| Consent, opt-out, timing, expiry, and touch checks | Calendar availability (locally generated slots) |
| Same-salesperson handoff and conflict-checked booking | Salesperson CRM task acknowledgement |
| Transactional state, activity record, audit export | All dealership/customer identity and performance data |

No real model is connected. This deliberately proves the workflow and authority boundary before attaching a model. There are no external calls or CDN assets. Interest and appointments are measured; closed sales and revenue are not claimed. Buckhead Motor Co. is fictional and does not represent an endorsement or affiliation with Mercedes-Benz of Buckhead.

## Key design decisions

**A GM dashboard, with a customer simulator.** The dashboard makes the queue, outcomes, exceptions, and offer boundaries visible. The simulator lets a decision-maker see exactly what the customer experiences without sending a real message.

**Money comes from policy, never model prose.** Original appraisal and per-lead cap come from the synthetic CRM. First-touch uplift is the lesser of $250, the lead cap, and the immutable $500 system cap. Integer cents avoid rounding ambiguity. A reminder reuses the issued quote; it does not add another increment. Changing a browser request cannot set the quote amount or customer-facing message.

**Two enforcement layers.** The server rejects invalid or excessive proposals. The SQLite offer ledger separately checks maximum uplift, per-lead cap, and total arithmetic, and rejects updates to an issued quote. These controls constrain the application, not the computer owner: a local administrator who changes the code or database can alter the system. Production would need restricted administrative access and authenticated policy change controls.

**Constrained actions instead of unrestricted text generation.** The mock classifier yields a small action vocabulary. An approved template inserts policy-authorized values. Unknown replies, bargaining, and attempted prompt injection become human tasks, with no automatic response or changed promise. A future LLM adapter should produce this same validated action schema; its free-form text must never be the outbound message body.

**Human ownership is preserved.** Interested leads leave the automated follow-up queue. Booking uses the original salesperson and rechecks available slots transactionally. All other human-owned states stop automatic conversation. Customer replies remain visible. An opt-out suppresses messaging without silently cancelling an existing appointment.

**A dependency-free local app.** Plain browser JavaScript, CSS, Node HTTP, and the Node SQLite module keep startup simple and offline. The SQLite integration uses documented [Node APIs](https://nodejs.org/docs/latest-v24.x/api/sqlite.html); tests use the built-in [test runner](https://nodejs.org/docs/latest-v24.x/api/test.html). No front-end framework is needed for this bounded prototype.

**Atomic local state.** One SQLite aggregate stores the demo state; a separate offer ledger holds checked quote snapshots. Transactions commit the quote, conversation, handoff, and audit together. This is a small single-dealer demo, not a multi-tenant CRM schema. Production should normalize entities, introduce tenant boundaries, and use an outbox for external delivery.

## Project map

```text
server.mjs                 Local-only HTTP server and API validation
lib/policy.mjs             Caps, eligibility, mock intent classifier, approved messages
lib/engine.mjs             Recovery, replies, booking, handoff, manager controls
lib/store.mjs              SQLite transactions and checked immutable offer ledger
lib/seed.mjs               Eight fictional visits and repeatable demo clock
public/                   Dashboard and customer simulator
test/                     Domain, database, persistence, and HTTP tests
data/                     Runtime database and launcher logs (created at startup)
PITCH.md                   Talk track, pilot proposal, and business questions
```

Run the verification suite:

```text
node --test test/engine.test.mjs test/http.test.mjs test/render.test.mjs
```

Tests include cap boundaries, hundreds of cap combinations, SQL rejection, duplicate cycles, prompt injection routing, opt-out precedence, quiet hours, expiry, paused activity, appointment conflicts, persistence, rollback, and HTTP request controls.

## Deliberate limits before a live pilot

- No live CRM ingestion, webhook reconciliation, contact deduplication, or reassignment synchronization. Fixture imports provide trusted names, appraisals, ownership, and consent. Real imports must validate all fields; arbitrary imported text must not be interpolated into messages.
- No real consent validation or legal/compliance certification. The demo’s opt-out rules and contact hours are product assumptions, not a statement that outreach is legally permissible. A dealer and its messaging provider must approve the live contact policy and templates.
- No real SMS, email, delivery receipts, number registration, timezone detection, or inbound signature verification.
- No actual LLM, background scheduler, live availability, or CRM task notifications. Inbound parsing is intentionally narrow; unfamiliar language goes to a human. Users click recovery cycles and advance a simulated clock.
- No staff authentication, role separation, multi-dealer isolation, encrypted backups, retention policy, or tamper-proof audit. The server binds to loopback, checks Host/Origin and a custom request header, and must not be exposed to the internet or loaded with real customer information.
- No automatic sale attribution or billing. A follow-up quote is an authorization subject to unchanged condition and reinspection, not a signed purchase contract or guaranteed payout. The human dealership handles final agreement.
- The exposure metric in the API is nominal uplift on outstanding quotes, not realized cost or an inventory valuation.

The next useful business step is to validate the smallest supported CRM export and the approved offer authority with one dealership, then scope an authenticated, monitored pilot around those facts.
