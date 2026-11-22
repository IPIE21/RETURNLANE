# Preorder System: Drop 001

## How it runs (on Shopify, once connected)
1. **Product setup:** the Ride the Tiger Tee gets one variant per size. Inventory tracking stays on, "continue selling when out of stock" stays off, and quantity per size is set to the cap.
2. **Preorder labeling:** the product page says "Preorder" and shows the ship window (from `config.js` → `shipWindow`). Shopify's order confirmation includes the same line (edit the Order Confirmation notification template).
3. **Payment:** charged at checkout through Shopify Payments. *Alternative:* Shopify's native pre-order purchase options can authorize now and charge later. That's more complex, so it's a later option.
4. **Checkout gate:** `checkoutEnabled: false` in `storefront/assets/config.js` until every approval in `../LAUNCH_STATUS.md` is ticked.

## Customer messages (paste into Shopify notifications or send manually)
**Order confirmation, extra block**
> Thanks for preordering Drop 001. Your shirt will be printed after preorders close on [date] and is expected to ship [window]. You can cancel for a full refund any time before [print start date] by replying to this email.

**Update 1: preorders closed (within 24h of close)**
> Preorders are closed. Your order #[n] ([size]) is locked in. Files go to our printer on [date]. Next update when printing starts.

**Update 2: printing**
> Your Ride the Tiger tee is being printed this week. Cancellations are now closed. Expected ship date: [date].

**Update 3: shipped**
Shopify's built-in shipping confirmation, with tracking.

**Delay message (if the ship window will be missed)**
> Quick heads-up: our print run is delayed by [x days] because [plain reason]. New expected ship date: [date]. If that doesn't work for you, reply and we'll refund you in full, no questions.

## Refund & cancellation terms (mirrors `storefront/shipping-returns.html`)
- Full refund on request any time before printing starts.
- Full refund if we miss the stated ship window by more than 14 days and you ask for it.
- After printing starts: no change-of-mind returns. Defects, misprints and wrong sizes are replaced or refunded within 14 days of delivery.
- Size exchanges while spares last (we print about 10% extra).

## Support workflow
| Step | Rule |
|---|---|
| Inbox | One shared address (e.g., help@domain). Shopify Inbox for site chat optional. |
| Response time | Within 2 business days. Same day during the preorder window. |
| Categories | Sizing · Cancel/refund · Shipping/tracking · Defect · Collab |
| Cancel/refund | Refund in Shopify admin → reply with confirmation. Log it in the tracker. |
| Defect | Ask for a photo → replace from spares or refund → log the cause. |
| Escalation | Anything legal, a chargeback, or a press request goes to the founder the same day. |

## Inventory & size tracking
- Live counts come from Shopify (Orders → filter by product → export).
- `preorder_tracker.csv` is the manual mirror for printer handoff (sizes → quantities + 10% spares).

## Conversion analytics
- Shopify Analytics: sessions, conversion rate, top referrers.
- UTMs on every bio/ad/email link (see `../marketing/FUNNEL.md`).
- Daily during the window, log: waitlist size, sessions, orders, conversion %, orders by size.
