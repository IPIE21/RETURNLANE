/* TROUBLE FINDS ME — shared site behavior (no dependencies). */
(function () {
  const C = window.TFM_CONFIG || {};
  const here = location.pathname.split("/").pop() || "index.html";
  const money = n => new Intl.NumberFormat("en-US", { style: "currency", currency: C.currency || "USD" }).format(n);

  /* ---------- prototype banner, header, footer ---------- */
  const NAV = [
    ["shop.html", "Drop 001"],
    ["ride-the-tiger.html", "Ride the Tiger"],
    ["about.html", "Story"],
    ["faq.html", "FAQ"],
    ["waitlist.html", "Waitlist"],
  ];
  const banner = C.checkoutEnabled ? "" :
    `<div class="proto" role="note">Preview site. Preorders are not open yet. Join the waitlist to get first access.</div>`;
  const header = `${banner}
  <header class="site"><div class="wrap navbar">
    <a class="logo" href="index.html">TROUBLE FINDS ME</a>
    <button class="menu-btn" id="menu-btn" type="button" aria-expanded="false" aria-controls="navlinks">Menu</button>
    <nav class="navlinks" id="navlinks" aria-label="Main">
      ${NAV.map(([h, t]) => `<a href="${h}"${h === here ? ' aria-current="page"' : ""}>${t}</a>`).join("")}
    </nav>
  </div></header>`;
  const social = [C.instagram && `<a href="${C.instagram}" rel="noopener">Instagram</a>`, C.tiktok && `<a href="${C.tiktok}" rel="noopener">TikTok</a>`].filter(Boolean).join("");
  const footer = `<footer class="site"><div class="wrap">
    <div class="footgrid">
      <div class="stack">
        <div class="logo">TROUBLE FINDS ME</div>
        <p style="color:var(--cream-2)">Old-school iron. Heavyweight cotton. Made for the people who show up anyway.</p>
      </div>
      <div><div class="eyebrow" style="margin-bottom:8px">Shop</div>
        <a href="shop.html">Drop 001</a><a href="ride-the-tiger.html">Ride the Tiger Tee</a><a href="size-guide.html">Size guide</a><a href="waitlist.html">Waitlist</a></div>
      <div><div class="eyebrow" style="margin-bottom:8px">Help</div>
        <a href="faq.html">FAQ</a><a href="shipping-returns.html">Shipping &amp; returns</a><a href="contact.html">Contact</a><a href="about.html">Our story</a>${social}</div>
    </div>
    <p class="fine">© ${new Date().getFullYear()} Trouble Finds Me. Product images are concept artwork, not photos of finished shirts.</p>
  </div></footer>`;
  document.body.insertAdjacentHTML("afterbegin", header);
  document.body.insertAdjacentHTML("beforeend", footer);

  const mb = document.getElementById("menu-btn"), nl = document.getElementById("navlinks");
  mb.addEventListener("click", () => { const o = nl.classList.toggle("open"); mb.setAttribute("aria-expanded", o); mb.textContent = o ? "Close" : "Menu"; });

  /* ---------- fill config-driven text ---------- */
  document.querySelectorAll("[data-price]").forEach(el => el.textContent = money(C.price));
  document.querySelectorAll("[data-ship-window]").forEach(el =>
    el.textContent = C.shipWindow || "We'll post the exact ship date before preorders open, once our printer confirms it.");
  document.querySelectorAll("[data-contact-email]").forEach(el => {
    if (C.contactEmail) { el.textContent = C.contactEmail; } else { el.textContent = "Email address coming with launch"; }
  });

  /* ---------- forms (waitlist + contact) ---------- */
  document.querySelectorAll("form[data-endpoint]").forEach(form => {
    form.addEventListener("submit", async e => {
      e.preventDefault();
      const msg = form.querySelector(".form-msg");
      const email = form.querySelector('input[type="email"]');
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim())) {
        msg.className = "form-msg err"; msg.textContent = "That email doesn't look right. Check it and try again."; email.focus(); return;
      }
      const consent = form.querySelector('input[name="consent"]');
      if (consent && !consent.checked) { msg.className = "form-msg err"; msg.textContent = "Tick the box so we're allowed to email you."; return; }
      const endpoint = C[form.dataset.endpoint];
      const data = Object.fromEntries(new FormData(form).entries());
      data.source = form.dataset.source || here;
      if (!endpoint) {
        msg.className = "form-msg ok";
        msg.textContent = "Preview mode: this form works, but signups aren't being saved yet.";
        form.reset(); return;
      }
      const btn = form.querySelector('button[type="submit"]'); btn.disabled = true;
      try {
        const r = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(data) });
        if (!r.ok) throw new Error(r.status);
        msg.className = "form-msg ok";
        msg.textContent = form.dataset.endpoint === "contactEndpoint" ? "Sent. We'll reply within 2 business days." : "You're on the list. Watch your inbox for early access.";
        form.reset();
      } catch (err) {
        msg.className = "form-msg err"; msg.textContent = "That didn't go through. Try again in a minute.";
      } finally { btn.disabled = false; }
    });
  });

  /* ---------- product page ---------- */
  const pdp = document.getElementById("pdp");
  if (pdp) {
    const main = document.getElementById("main-img");
    document.querySelectorAll(".thumbs button").forEach(b => b.addEventListener("click", () => {
      document.querySelectorAll(".thumbs button").forEach(x => x.setAttribute("aria-pressed", x === b));
      main.src = b.dataset.src; main.alt = b.dataset.alt;
    }));
    let size = null, qty = 1;
    const sizesEl = document.getElementById("sizes");
    sizesEl.innerHTML = (C.sizes || []).map(s => `<button type="button" aria-pressed="false" data-size="${s}">${s}</button>`).join("");
    sizesEl.addEventListener("click", e => {
      const b = e.target.closest("button[data-size]"); if (!b) return;
      size = b.dataset.size;
      sizesEl.querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", x === b));
      update();
    });
    const out = document.getElementById("qty");
    document.getElementById("qty-minus").onclick = () => { qty = Math.max(1, qty - 1); out.value = qty; };
    document.getElementById("qty-plus").onclick = () => { qty = Math.min(5, qty + 1); out.value = qty; };
    const buys = document.querySelectorAll("[data-buy]");
    const status = document.getElementById("buy-status");
    function update() {
      buys.forEach(b => {
        if (!C.checkoutEnabled) { b.textContent = "Join the waitlist"; b.disabled = false; }
        else { b.textContent = size ? `Preorder · ${size}` : "Select a size"; b.disabled = !size; }
      });
    }
    buys.forEach(b => b.addEventListener("click", () => {
      if (!C.checkoutEnabled) { location.href = "waitlist.html"; return; }
      const id = (C.variantIds || {})[size];
      if (!size) { status.textContent = "Pick a size first."; return; }
      if (!C.shopifyDomain || !id) { status.textContent = "Checkout isn't connected yet. Join the waitlist instead."; return; }
      // Shopify cart permalink: hands off to Shopify's hosted, PCI-compliant checkout.
      location.href = `https://${C.shopifyDomain}/cart/${encodeURIComponent(id)}:${qty}`;
    }));
    if (document.querySelector(".sticky-buy")) document.body.classList.add("has-sticky");
    update();
  }
})();
