# LAUNCH_STATUS: TROUBLE FINDS ME, Drop 001

_Last updated: 2026-11-22_

**Bottom line:** the storefront prototype, waitlist funnel, sourcing plan, cost model and full marketing kit are built. **Nothing can take money yet**, by design. The critical path is **print-ready artwork → printer quotes + sample → your approvals → open checkout.**

## ✅ Completed (done and verified)
| Item | Where | How it was checked |
|---|---|---|
| Repository with all required folders | `/` | Local git repo, committed |
| Artwork audit + colorway evaluation | `brand/ARTWORK_AUDIT.md` | Measured the source files: back art is about 40 DPI at 12", not print-ready |
| Brand guide | `brand/BRAND_GUIDE.md` | — |
| Storefront prototype, 9 pages (home, product, collection, size guide, story, FAQ, contact, shipping & returns, waitlist) | `storefront/` | Playwright on desktop (1280px) + iPhone 13: no JS errors, no broken links, no horizontal overflow |
| Product page: front/back gallery, size selector, qty, price, specs, preorder explanation, sticky mobile buy bar | `storefront/ride-the-tiger.html` | Size selection and button states tested |
| Checkout gate + Shopify handoff | `storefront/assets/config.js`, `app.js` | Off: buttons route to the waitlist and a site-wide "preorders not open" banner shows. On (tested with a fake store): sends to `https://<store>/cart/<variant>:<qty>` (Shopify hosted checkout, no card data on our site). Config restored to **off**. |
| Waitlist + contact forms | `storefront/` | Email validation, consent checkbox, preview mode verified (nothing stored or sent) |
| Supplier research, quote request template, quote tracker | `suppliers/SOURCING.md` | GSM figures sourced and linked. Prices marked as estimates. |
| Unit economics model + break-even | `finance/model.py`, `finance/unit_economics.md` | Script runs. All inputs labeled as estimates. |
| Product spec + copy, with a "claims we don't make yet" list | `products/ride-the-tiger.md` | — |
| Marketing: 30-day calendar, 15 video concepts, 10 captions, 5 emails, 3 ad concepts, influencer templates, ambassador program, referral proposal, signup funnel | `marketing/` | — |
| **Shopify theme** (custom, matches the preview): home, product with size picker, collection, cart, waitlist, size guide, FAQ, contact, story, search, 404, password/coming-soon page with waitlist | `shopify-theme/`, `trouble-finds-me-theme.zip` | Shopify's official theme check: **0 errors** (6 warnings for Google Fonts, acceptable). Not yet rendered on a live store, which needs your Shopify account. |
| Shopify product import (Ride the Tiger, S–2XL, $42, draft) + setup guide incl. domain connection | `products/shopify_products.csv`, `shopify-theme/SETUP.md` | CSV generated in Shopify's import format |
| First social assets: IG story (waitlist) + square quote card | `marketing/assets/*.png` | Rendered and visually checked. Concept art labeled. |
| Preorder system: notifications, refund terms, support workflow, size tracker, analytics | `launch/PREORDER_SYSTEM.md`, `launch/preorder_tracker.csv` | — |
| Timeline + QA checklist | `launch/TIMELINE_CHECKLIST.md` | — |

## 🔧 In progress / not done
- **Supplier quotes:** none requested yet (contacting businesses needs approval). All costs are estimates.
- **Print-ready artwork:** doesn't exist yet. The dagger → tattoo edit is still pending.
- **Red/cream variant of the current design:** doesn't exist. Only the older "Bad Boy / Lifting Club" red version does.
- **Logo / neck-tag mark:** not designed.
- **Storefront hosting:** a private preview is published for review. No public deployment.

## ⛔ Blockers
1. **Artwork:** an AI raster mockup can't be screen printed. Needs an illustrator redraw + color separations (about $150).
2. **The Shopify store isn't created yet.** You own the domain. Follow `shopify-theme/SETUP.md` to create the store, upload the theme and connect the domain. No email tool or social accounts are connected to this workspace. Store setup, the waitlist endpoint and posting all need your accounts.
3. **No remote repository:** this project is a local git repo in a temporary cloud container. It needs a GitHub repo (or download) to be kept. **Files here are lost when the session ends.**
4. **Fabric specs unconfirmed** until a sample of the chosen blank is in hand.

## 🔒 Approvals needed from you
| # | Decision | My recommendation |
|---|---|---|
| 1 | Colorway for Drop 001 | Burnt orange + old gold + cream on black |
| 2 | Retail price | $42 (contribution about $14 at 25 units, about $19 at 50) |
| 3 | Spend about $150 on an illustrator redraw + copyright transfer | Yes. Required to print. |
| 4 | Spend about $30–60 on 1–2 DTF samples (Shaka drop-shoulder blank) | Yes. Needed for real photos and fit. |
| 5 | Send the quote request to 2 local printers + Rush Order Tees | Yes |
| 6 | Create a Shopify store (Basic, about $39/mo) + buy a domain (about $15/yr) | Yes, in week 2 |
| 7 | Create/connect a GitHub repo for this project | Yes, today, so nothing is lost |
| 8 | Publish organic posts (Days 1–7 waitlist content) | Yes, once the IG/TT handles exist |
| 9 | Influencer/ambassador outreach | After samples arrive |
| 10 | Paid ads ($10/day test) | After real product photos |
| 11 | **Open checkout** (`checkoutEnabled: true`) | Only after 1–6 are done and the ship date is confirmed |

## ▶️ Next actions
1. **You:** approve #1–#5 and #7. Send me the GitHub repo name to push to, or tell me to package a download.
2. **Me (after approval):** finalize the illustrator brief and quote emails for you to send, and set up the Shopify product import CSV.
3. **When quotes arrive:** update `finance/model.py`, lock the price, set the run size.
4. **When the sample arrives:** measure → size guide; weigh → GSM claim and label cost; photograph → replace concept art on the site.
5. **Then:** connect Shopify + email, run a test order, get final approval, open preorders for 10 days. Target: 25 paid preorders.
