# TROUBLE FINDS ME

Premium gym-streetwear brand. Drop 001: **Ride the Tiger** heavyweight tee.

Start with **[LAUNCH_STATUS.md](LAUNCH_STATUS.md)**.

| Folder | Contents |
|---|---|
| `storefront/` | Static, mobile-first storefront prototype. `python3 build.py` regenerates pages. Settings in `assets/config.js`. |
| `brand/` | Brand guide, artwork audit, source art |
| `products/` | Product spec and copy |
| `suppliers/` | Blank and printer comparison, quote request, tracker |
| `marketing/` | Content calendar, videos, captions, emails, ads, partnerships, funnel, social assets |
| `finance/` | Unit economics model (`model.py`) and summary |
| `launch/` | Timeline, checklist, preorder system, order tracker |

## Run the storefront locally
```bash
cd storefront && python3 -m http.server 8000   # open http://localhost:8000
```

## Go live (after approvals)
1. Create a Shopify store, add the product with one variant per size.
2. In `storefront/assets/config.js`: set `shopifyDomain`, `variantIds`, `waitlistEndpoint`, `contactEmail`, `shipWindow`.
3. Deploy `storefront/` to any static host (Netlify, Cloudflare Pages, GitHub Pages), or port the pages into a Shopify theme.
4. Flip `checkoutEnabled` to `true` only after final approval.
