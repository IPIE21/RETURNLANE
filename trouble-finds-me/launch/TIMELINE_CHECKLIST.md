# Launch Timeline & Checklist: Drop 001

Week numbers start the day you approve this plan. Items marked 🔒 need your approval (spending money, publishing, contacting people, or opening checkout).

## Week 1: Lock the product
- [ ] Approve colorway: burnt orange/gold/cream (recommended) or red/cream
- [ ] Approve price ($42 proposed)
- [ ] 🔒 Hire an illustrator to redraw and separate the art, dagger → tattoo (about $150). Brief in `../brand/ARTWORK_AUDIT.md`.
- [ ] 🔒 Send the quote request to 2 local printers + Rush Order Tees (template in `../suppliers/SOURCING.md`)
- [ ] 🔒 Order 1–2 DTF samples on the Shaka drop-shoulder blank
- [ ] Start posting Days 1–7 content (organic, no product claims). 🔒 Publishing to live accounts.

## Week 2: Store + waitlist
- [ ] 🔒 Create a Shopify store (Basic) and buy a domain
- [ ] Load the product: variants S–2XL, price, inventory caps, preorder copy
- [ ] Connect the waitlist form (`waitlistEndpoint`) and set up EM1 as an automation
- [ ] Put the Shopify domain + variant IDs into `config.js`, keep `checkoutEnabled: false`
- [ ] Deploy the storefront (Shopify theme or static host) and test on a phone
- [ ] Samples arrive → measure → update the size guide and GSM claim → shoot real photos

## Week 3: Preorder window (only after all approvals)
- [ ] Confirm the printer turnaround → set `shipWindow` → finalize the policy page
- [ ] 🔒 **Final approval: open checkout** (`checkoutEnabled: true`)
- [ ] Place 1 real test order and refund it
- [ ] EM2 → EM3 (waitlist 1 hour early) → public launch post
- [ ] Daily: track orders by size, answer DMs, post per the calendar

## Week 4+: Production
- [ ] Close preorders → export sizes → 🔒 place the print order (preorders + 10%)
- [ ] Update emails 1 → 2 → ship
- [ ] Pack, ship, post behind-the-scenes content, collect real reviews (only from real customers)

## Pre-launch QA checklist
- [ ] Every product photo is either a real photo or labeled concept art
- [ ] Price, ship window and refund terms match on the product page, FAQ, policies and emails
- [ ] Test order on iPhone + Android, Apple Pay works, confirmation email reads correctly
- [ ] Policies set in Shopify (refund, shipping, privacy, terms)
- [ ] No GSM, "limited to N," or date claims that aren't confirmed
