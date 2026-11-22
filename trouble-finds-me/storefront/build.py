#!/usr/bin/env python3
"""Generates the static storefront pages. Edit page bodies here, then run:  python3 build.py
Shared header/footer/banner are injected at runtime by assets/app.js; settings live in assets/config.js."""
from pathlib import Path

HERE = Path(__file__).parent
FONTS = ("https://fonts.googleapis.com/css2?family=Anton&family=Archivo:wght@400;500;700"
         "&family=JetBrains+Mono:wght@400;600&family=Yellowtail&display=swap")

def page(fname, title, desc, body, og_img="assets/img/rtt-orange-back.jpg"):
    html = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{title}</title>
<meta name="description" content="{desc}">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:image" content="{og_img}">
<meta name="theme-color" content="#141414">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="{FONTS}">
<link rel="stylesheet" href="assets/styles.css">
</head>
<body>
<main id="content">
{body}
</main>
<script src="assets/config.js"></script>
<script src="assets/app.js"></script>
</body>
</html>
"""
    (HERE / fname).write_text(html)

SIGNUP = lambda src, cta="Get early access": f"""
<form class="signup" data-endpoint="waitlistEndpoint" data-source="{src}" novalidate>
  <div class="field"><label for="email-{src}">Email</label>
    <input id="email-{src}" name="email" type="email" autocomplete="email" placeholder="you@example.com" required></div>
  <div class="field" style="flex:0 1 140px"><label for="size-{src}">Your size</label>
    <select id="size-{src}" name="size"><option value="">Not sure</option><option>S</option><option>M</option><option>L</option><option>XL</option><option>2XL</option></select></div>
  <label class="check" for="consent-{src}"><input id="consent-{src}" name="consent" type="checkbox" value="yes"> Email me about Drop 001 and future drops. Unsubscribe anytime.</label>
  <button class="btn red full" type="submit">{cta}</button>
  <p class="form-msg" role="status" aria-live="polite"></p>
</form>"""

QUOTES = "CHEW GLASS ★ BREATHE SMOKE ★ RIDE THE TIGER ★ TROUBLE FINDS ME ★ HEAVYWEIGHT ★ OVERSIZED ★ "

# ---------------- Home ----------------
page("index.html", "Trouble Finds Me", "Old-school bodybuilding meets oversized heavyweight streetwear. Drop 001: Ride the Tiger.", f"""
<section class="hero"><div class="grain"></div><div class="wrap">
  <div>
    <div class="eyebrow">Drop 001 · Ride the Tiger</div>
    <h1><span>Trouble</span><span>finds me.</span></h1>
    <p class="lede">Old-school iron culture on heavyweight, boxy pump covers. Loud on the back, quiet on the front, built for the hours nobody sees.</p>
    <div class="ctas"><a class="btn" href="ride-the-tiger.html">See the tee</a><a class="btn ghost" href="waitlist.html">Join the waitlist</a></div>
  </div>
  <div class="art"><img src="assets/img/rtt-orange-back.jpg" alt="Back of the Ride the Tiger tee: a jacked vintage bad boy riding a roaring tiger under the words Chew Glass Breathe Smoke" width="768" height="1024">
    <p class="caption">Concept artwork. Not a photo of the finished shirt.</p></div>
</div></section>
<div class="marquee" aria-hidden="true"><div>{QUOTES*4}</div></div>

<section class="block"><div class="wrap split">
  <img src="assets/img/rtt-orange-pair.jpg" alt="Front and back of the Ride the Tiger tee on black" width="1536" height="1024" style="background:var(--cream)">
  <div class="stack">
    <div class="eyebrow">The first one</div>
    <h2>Ride the <span class="script">Tiger</span></h2>
    <p style="color:var(--cream-2)">"Trouble Finds Me" across the chest. On the back, a jacked old-school bad boy riding a tiger with "Chew Glass, Breathe Smoke" over the top. One graphic, one run, then it's gone.</p>
    <div><span class="tag">Limited first run</span></div>
    <div class="ctas" style="display:flex;gap:12px;flex-wrap:wrap"><a class="btn" href="ride-the-tiger.html">Details · <span data-price></span></a></div>
  </div>
</div></section>

<section class="block"><div class="wrap">
  <div class="eyebrow">What we make</div>
  <h2>Built like the old gyms</h2>
  <div class="pillars">
    <div><h3>Heavyweight</h3><p>Thick cotton that holds its shape over a pump and through a hundred washes. Final fabric weight is confirmed before we sell a single shirt.</p></div>
    <div><h3>Boxy cut</h3><p>Dropped shoulders, wide body, cropped just right. A pump cover you'll also wear out of the gym.</p></div>
    <div><h3>Real graphics</h3><p>Screen-printed vintage art, not another motivational quote in a default font.</p></div>
  </div>
</div></section>

<section class="block"><div class="wrap split">
  <div class="stack">
    <div class="eyebrow">First access</div>
    <h2>Get in before the drop</h2>
    <p style="color:var(--cream-2)">The waitlist hears about preorders first, before we post anywhere. First run is small.</p>
  </div>
  <div>{SIGNUP("home")}</div>
</div></section>
""")

# ---------------- Collection ----------------
page("shop.html", "Drop 001 · Trouble Finds Me", "Drop 001 from Trouble Finds Me: the Ride the Tiger heavyweight tee.", """
<div class="page-head"><div class="wrap">
  <div class="eyebrow">Collection</div><h1>Drop 001</h1>
  <p>The first release. One graphic, limited run, made to order during a short preorder window.</p>
</div></div>
<section class="block"><div class="wrap">
  <div class="grid">
    <a class="card" href="ride-the-tiger.html">
      <div class="img"><img src="assets/img/rtt-orange-back.jpg" alt="Ride the Tiger tee, back" loading="lazy" width="768" height="1024"></div>
      <div class="meta"><span class="tag" style="align-self:flex-start">Preorder soon</span><h3>Ride the Tiger Tee</h3><span class="eyebrow">Black · <span data-price></span></span></div>
    </a>
    <div class="card soon"><div class="img">Next drop</div><div class="meta"><h3>To be announced</h3><span class="eyebrow">Waitlist hears first</span></div></div>
  </div>
</div></section>
""")

# ---------------- Product ----------------
page("ride-the-tiger.html", "Ride the Tiger Tee · Trouble Finds Me",
     "Heavyweight oversized tee. Trouble Finds Me on the chest, Chew Glass Breathe Smoke and the tiger rider on the back.", """
<div class="wrap pdp" id="pdp">
  <div class="gallery">
    <div class="main"><img id="main-img" src="assets/img/rtt-orange-back.jpg" alt="Ride the Tiger tee, back" width="768" height="1024"></div>
    <div class="thumbs">
      <button type="button" aria-pressed="true" aria-label="Show back" data-src="assets/img/rtt-orange-back.jpg" data-alt="Ride the Tiger tee, back"><img src="assets/img/rtt-orange-back.jpg" alt=""></button>
      <button type="button" aria-pressed="false" aria-label="Show front" data-src="assets/img/rtt-orange-front.jpg" data-alt="Ride the Tiger tee, front"><img src="assets/img/rtt-orange-front.jpg" alt=""></button>
    </div>
    <p class="caption">Concept artwork shown. Photos of the actual shirt go up when samples arrive.</p>
  </div>
  <div class="buybox">
    <div class="eyebrow">Drop 001</div>
    <h1 style="font-size:clamp(44px,6vw,72px)">Ride the Tiger Tee</h1>
    <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap"><span class="price" data-price></span><span class="tag">Preorder</span></div>
    <p style="color:var(--cream-2)">"Trouble Finds Me" across the chest. On the back: a jacked vintage bad boy riding a roaring tiger, with "Chew Glass, Breathe Smoke" up top and "Ride the Tiger" in script below.</p>
    <div class="stack" style="gap:10px">
      <div style="display:flex;justify-content:space-between;align-items:baseline"><label id="size-label">Size</label><a href="size-guide.html" class="eyebrow">Size guide</a></div>
      <div class="sizes" id="sizes" role="group" aria-labelledby="size-label"></div>
    </div>
    <div style="display:flex;gap:12px;align-items:center">
      <label for="qty">Qty</label>
      <div class="qty"><button type="button" id="qty-minus" aria-label="Decrease quantity">−</button><output id="qty" for="qty-minus qty-plus">1</output><button type="button" id="qty-plus" aria-label="Increase quantity">+</button></div>
    </div>
    <button class="btn red full" type="button" data-buy>Join the waitlist</button>
    <p id="buy-status" class="form-msg" role="status" aria-live="polite"></p>
    <div class="notice"><b>How the preorder works</b>
      <span>We print the run after the preorder window closes, then ship. Shipping window: <span data-ship-window></span></span>
      <span>Cancel for a full refund any time before printing starts. Details on the <a href="shipping-returns.html">shipping &amp; returns</a> page.</span></div>
    <div>
      <details open><summary>Fit &amp; fabric</summary><div>
        <p>Oversized, boxy fit with dropped shoulders and a thick ribbed collar. Take your normal size for the intended oversized look.</p>
        <p>Heavyweight 100% cotton blank. The exact weight and blank are being confirmed with samples and will be listed here before preorders open.</p></div></details>
      <details><summary>Print</summary><div><p>Screen-printed. Front: one color. Back: multi-color vintage graphic with a worn texture that's part of the design.</p></div></details>
      <details><summary>Care</summary><div><p>Wash cold, inside out. Hang dry or tumble low. Don't iron the print.</p></div></details>
    </div>
  </div>
</div>
<div class="sticky-buy"><div><div class="eyebrow">Ride the Tiger</div><b data-price></b></div><button class="btn red" type="button" data-buy>Join the waitlist</button></div>
""")

# ---------------- Size guide ----------------
rows = [("S", '21½"', '27½"', '9"'), ("M", '22½"', '28½"', '9½"'), ("L", '23½"', '29½"', '10"'), ("XL", '24½"', '30½"', '10½"'), ("2XL", '25½"', '31½"', '11"')]
page("size-guide.html", "Size Guide · Trouble Finds Me", "How the Ride the Tiger tee fits.", f"""
<div class="page-head"><div class="wrap"><div class="eyebrow">Fit</div><h1>Size guide</h1>
<p>Boxy and oversized by design. Take your normal size for the intended fit, or size down for a closer fit.</p></div></div>
<section class="block"><div class="wrap">
  <div class="notice"><b>Target measurements</b><span>These are the fit targets for Drop 001. We'll measure the production samples and update this table before preorders open.</span></div>
  <div class="table-wrap"><table>
    <thead><tr><th>Size</th><th>Chest (pit to pit)</th><th>Length (shoulder to hem)</th><th>Sleeve</th></tr></thead>
    <tbody>{''.join(f'<tr><td>{a}</td><td>{b}</td><td>{c}</td><td>{d}</td></tr>' for a,b,c,d in rows)}</tbody>
  </table></div>
  <div class="prose" style="margin-top:28px">
    <h3>How to measure</h3>
    <p>Lay your favorite tee flat. Measure straight across from armpit to armpit for chest, and from the top of the shoulder seam to the hem for length. Compare with the table.</p>
  </div>
</div></section>
""")

# ---------------- About ----------------
page("about.html", "Our Story · Trouble Finds Me", "Why Trouble Finds Me exists.", """
<div class="page-head"><div class="wrap"><div class="eyebrow">Story</div><h1>Trouble finds me</h1></div></div>
<section class="block"><div class="wrap split">
  <div class="prose">
    <p>Trouble Finds Me started with a notebook of lines that meant something in the gym. <i>A rocket ship burns the most fuel at take off.</i> <i>Whatever you hate is what you need.</i> <i>Chew glass, breathe smoke, ride the tiger.</i></p>
    <p>Most gym clothing says the same five things in the same font. We wanted shirts that look like they came from an old iron gym with chalk on the floor and a story behind every graphic.</p>
    <p>So every piece is heavyweight, cut boxy enough to cover a pump, and printed with original vintage-style art. We drop in small runs and make each one count.</p>
    <p>Trouble finds everybody. The question is whether you ride it.</p>
  </div>
  <img src="assets/img/rtt-orange-back.jpg" alt="Ride the Tiger back graphic" loading="lazy" width="768" height="1024" style="background:var(--cream)">
</div></section>
""")

# ---------------- FAQ ----------------
faqs = [
 ("What is a preorder?", "You reserve your shirt during a short preorder window. When the window closes we print the whole run, then ship. It lets a small brand make exactly what people want instead of guessing."),
 ("When will my shirt ship?", 'Shipping window: <span data-ship-window></span>'),
 ("Can I cancel?", "Yes. Cancel any time before printing starts for a full refund. Once printing starts, the order is final because each shirt is made for you, though defects are always covered."),
 ("How does it fit?", 'Oversized and boxy with dropped shoulders. See the <a href="size-guide.html">size guide</a>.'),
 ("How heavy is the shirt?", "Heavyweight cotton. We're confirming the exact blank and weight with samples and will list it on the product page before preorders open."),
 ("Is the artwork exactly what I'll get?", "The images are concept artwork. The printed shirt follows the same design. We'll post real photos of samples before preorders open."),
 ("Do you ship internationally?", "Drop 001 ships within the US. If you're outside the US, join the waitlist and tell us where; it helps us plan."),
 ("How do I reach you?", 'Use the <a href="contact.html">contact page</a>.'),
]
page("faq.html", "FAQ · Trouble Finds Me", "Answers about preorders, sizing and shipping.", f"""
<div class="page-head"><div class="wrap"><div class="eyebrow">Help</div><h1>FAQ</h1></div></div>
<section class="block"><div class="wrap" style="max-width:820px">
{''.join(f'<details><summary>{q}</summary><div><p>{a}</p></div></details>' for q,a in faqs)}
</div></section>
""")

# ---------------- Contact ----------------
page("contact.html", "Contact · Trouble Finds Me", "Get in touch with Trouble Finds Me.", """
<div class="page-head"><div class="wrap"><div class="eyebrow">Help</div><h1>Contact</h1>
<p>Questions about sizing, an order, or a collab with your gym or club. We reply within 2 business days.</p></div></div>
<section class="block"><div class="wrap split" style="align-items:start">
  <form class="signup" data-endpoint="contactEndpoint" data-source="contact" novalidate style="flex-direction:column;flex-wrap:nowrap">
    <div class="field"><label for="c-name">Name</label><input id="c-name" name="name" autocomplete="name" required></div>
    <div class="field"><label for="c-email">Email</label><input id="c-email" name="email" type="email" autocomplete="email" required></div>
    <div class="field"><label for="c-topic">Topic</label><select id="c-topic" name="topic"><option>Sizing</option><option>My order</option><option>Gym / club collab</option><option>Other</option></select></div>
    <div class="field"><label for="c-msg">Message</label><textarea id="c-msg" name="message" required></textarea></div>
    <button class="btn red full" type="submit">Send message</button>
    <p class="form-msg" role="status" aria-live="polite"></p>
  </form>
  <div class="prose"><h3>Email</h3><p data-contact-email></p><h3>Gyms &amp; clubs</h3><p>Run a lifting club or gym? We do small collab runs. Pick "Gym / club collab" and tell us about your crew.</p></div>
</div></section>
""")

# ---------------- Shipping & returns ----------------
page("shipping-returns.html", "Shipping & Returns · Trouble Finds Me", "Preorder, shipping, cancellation and return terms.", """
<div class="page-head"><div class="wrap"><div class="eyebrow">Policies</div><h1>Shipping &amp; returns</h1>
<p>Draft terms for Drop 001. Final terms are confirmed before preorders open.</p></div></div>
<section class="block"><div class="wrap"><div class="prose">
  <h3>Preorders</h3>
  <p>Drop 001 is made to order. Preorders are open for a limited window. When it closes, we send the run to print and email you an update.</p>
  <p>Shipping window: <span data-ship-window></span> If printing is delayed, we'll email you with the new date and you can cancel for a full refund.</p>
  <h3>Shipping</h3>
  <p>US only for Drop 001. Shipping cost is shown at checkout. You'll get a tracking number by email when your order ships.</p>
  <h3>Cancellations</h3>
  <p>Cancel any time before printing starts for a full refund to your original payment method. Contact us with your order number.</p>
  <h3>Returns &amp; exchanges</h3>
  <p>Because each shirt is printed to order, we can't take returns for change of mind once printing starts. If your shirt arrives damaged, misprinted, or in the wrong size, contact us within 14 days of delivery with a photo and we'll replace it or refund you.</p>
  <p>Size exchanges are offered while spare stock lasts. Unworn, unwashed, within 14 days.</p>
  <h3>Payments</h3>
  <p>Payments are processed by our checkout provider. We never see or store your card details.</p>
</div></div></section>
""")

# ---------------- Waitlist ----------------
page("waitlist.html", "Waitlist · Trouble Finds Me", "Get first access to Drop 001: Ride the Tiger.", f"""
<section class="hero"><div class="grain"></div><div class="wrap">
  <div>
    <div class="eyebrow">Drop 001 · First access</div>
    <h1 style="font-size:clamp(48px,9vw,110px)"><span>Ride the</span><span class="script" style="font-size:.9em">Tiger</span></h1>
    <p class="lede">Waitlist members get the preorder link before anyone else. Small first run.</p>
    {SIGNUP("waitlist", "Join the waitlist")}
  </div>
  <div class="art"><img src="assets/img/rtt-orange-pair.jpg" alt="Front and back of the Ride the Tiger tee" width="1536" height="1024">
    <p class="caption">Concept artwork. Not a photo of the finished shirt.</p></div>
</div></section>
""")
print("built")
