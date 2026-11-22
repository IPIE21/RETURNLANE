# Drop 001 Unit Economics: Ride the Tiger Tee

> **Status: ESTIMATES ONLY.** No supplier has quoted yet. Every input is in `model.py`; replace them with real quotes and rerun.

## Inputs (estimates)
| Item | Value | Basis |
|---|---|---|
| Retail price | $42.00 | Middle of the $39.99–$44.99 target |
| Shipping charged | $6.00 flat | Proposal |
| Shipping label | $5.50 | Typical USPS Ground Advantage for about 12 oz. Verify in Shopify Shipping. |
| Packaging | $0.75 | Poly mailer, sticker, card |
| Card fees | 2.9% + $0.30 | Shopify Payments, Basic plan. Verify at signup. |
| Blank | $11.00 (+$2 2XL) | Heavyweight drop-shoulder blank, wholesale. See `../suppliers/SOURCING.md`. |
| Screens | 5 × $25 | Front 1 color, back 3 colors + white underbase on black. Industry range is $20–50 per screen. |
| Print per piece | $9.00 / $6.50 / $4.50 / $3.25 at 25 / 50 / 100 / 250 | Inside published one-color ranges, adjusted up for 2 locations |
| One-time launch costs | $264 | Art cleanup $150, sample $60, Shopify month $39, domain $15 |

## Results (output of `model.py`)
| Run size | Landed cost / shirt | Fees / order | Contribution / shirt | Margin on price | Cash needed to print run | Profit if run sells out |
|---|---|---|---|---|---|---|
| 25 | $26.20 | $1.69 | $13.86 | 33% | $655 | $82 |
| 50 | $20.90 | $1.69 | $19.16 | 46% | $1,045 | $694 |
| 100 | $17.45 | $1.69 | $22.61 | 54% | $1,745 | $1,997 |
| 250 | $15.31 | $1.69 | $24.75 | 59% | $3,827 | $5,923 |

**Break-even if you print first and then sell:** 23 of 25, 33 of 50, 50 of 100, 102 of 250.

## What this means
1. **At 25 shirts, Drop 001 roughly breaks even.** The goal of the first 25 is proof, content and customers, not profit. Margin improves fast at 50+.
2. **Print only what's preordered**, plus about 10% spares for exchanges and defects. Because customers pay first, the printing cost is covered before you spend it, and break-even is just the $264 of launch costs, which about 19 preorders cover at the 25-tier cost.
3. **The biggest lever is color count on the back.** Each extra screen on a 25-piece run adds about $1 per shirt. If the printer can do the back in 2 colors plus underbase, the 25-run cost drops by about $1–2.
4. **Pricing:** $42 is defensible for heavyweight streetwear. At $44.99, the 25-run contribution rises to about $16.80.
5. **Cash needed before preorders are paid out:** about $264 (launch costs). Shopify typically pays out within a few business days, which funds the print run.

## To make this real
- [ ] Get 3 written quotes (see `../suppliers/SOURCING.md`) and replace the blank, screens, print and freight inputs.
- [ ] Confirm the Shopify plan price and payment rates at signup.
- [ ] Weigh a sample shirt in a mailer to set the label cost.
