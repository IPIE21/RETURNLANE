#!/usr/bin/env python3
"""Drop 001 unit economics. ALL inputs are ESTIMATES until replaced with real quotes.
Edit the numbers below, run `python3 model.py`, and paste the output into unit_economics.md."""

PRICE = 42.00                 # proposed retail (target $39.99–$44.99)
SHIP_CHARGED = 6.00           # flat shipping charged to customer (proposal)
SHIP_LABEL = 5.50             # est. USPS Ground Advantage, ~12 oz tee in poly mailer
PACKAGING = 0.75              # poly mailer + sticker + card (est.)
CARD_PCT, CARD_FIXED = 0.029, 0.30   # Shopify Payments online rate on Basic plan (verify at signup)

BLANK = 11.00                 # est. heavyweight drop-shoulder blank, wholesale, black, S–XL
BLANK_2XL_UPCHARGE = 2.00     # est.; applied to ~10% of units
SCREENS = 5                   # front 1 color + back 3 colors + 1 white underbase on black
SCREEN_FEE = 25.00            # est. per screen, one-time per run
PRINT_PER_PIECE = {25: 9.00, 50: 6.50, 100: 4.50, 250: 3.25}  # est. both locations, by run size
INBOUND_FREIGHT = {25: 25, 50: 35, 100: 50, 250: 90}           # printer -> you (est.)

FIXED_LAUNCH = {              # one-time, not per run
    "Artwork cleanup / vectorization by illustrator": 150.00,
    "Pre-production sample (1–2 shirts incl. shipping)": 60.00,
    "Shopify Basic, 1 month (verify current price)": 39.00,
    "Domain, 1 year (est.)": 15.00,
}

def run(q):
    blank = BLANK + BLANK_2XL_UPCHARGE * 0.10
    setup = SCREENS * SCREEN_FEE
    cogs = blank + PRINT_PER_PIECE[q] + (setup + INBOUND_FREIGHT[q]) / q
    revenue = PRICE + SHIP_CHARGED
    fees = revenue * CARD_PCT + CARD_FIXED
    contribution = revenue - fees - SHIP_LABEL - PACKAGING - cogs
    return cogs, fees, contribution

fixed = sum(FIXED_LAUNCH.values())
print(f"Price ${PRICE:.2f} + ${SHIP_CHARGED:.2f} shipping | launch fixed costs ${fixed:.2f}\n")
print("| Run size | Landed cost / shirt | Fees / order | Contribution / shirt | Margin on price | Cash needed to print run | Profit if run sells out |")
print("|---|---|---|---|---|---|---|")
for q in PRINT_PER_PIECE:
    cogs, fees, c = run(q)
    print(f"| {q} | ${cogs:.2f} | ${fees:.2f} | ${c:.2f} | {c/PRICE*100:.0f}% | ${cogs*q:,.0f} | ${c*q-fixed:,.0f} |")

# break-even: preorders needed to cover printing a run of size q plus launch fixed costs
print("\nBreak-even preorders (sell n of a printed run of q; unsold shirts are a loss):")
for q in PRINT_PER_PIECE:
    cogs, fees, c = run(q)
    per_sale = c + cogs                      # cash in per sale after fees/shipping/packaging
    n = (cogs * q + fixed) / per_sale
    print(f"- Print {q}: need {n:.0f} sold")
