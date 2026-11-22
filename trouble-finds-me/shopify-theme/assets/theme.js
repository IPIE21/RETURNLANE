/* Trouble Finds Me theme behavior (no dependencies) */
(function () {
  // Mobile menu
  const mb = document.getElementById('menu-btn'), nl = document.getElementById('navlinks');
  if (mb && nl) mb.addEventListener('click', () => {
    const o = nl.classList.toggle('open'); mb.setAttribute('aria-expanded', o); mb.textContent = o ? 'Close' : 'Menu';
  });

  // Waitlist: add a size tag to the Shopify customer tags
  document.querySelectorAll('[data-size-tag]').forEach(sel => sel.addEventListener('change', () => {
    const tags = sel.form.querySelector('[data-tags]');
    tags.value = 'waitlist,drop001' + (sel.value ? ',size-' + sel.value : '');
  }));
  // Scroll to a form that was just submitted (Shopify reloads the page)
  if (/customer_posted=true|contact_posted=true/.test(location.search) || location.hash.indexOf('waitlist') > -1 || location.hash === '#contact-form') {
    const f = document.querySelector(location.hash || '.form-msg.ok'); if (f) f.scrollIntoView({ block: 'center' });
  }

  // Product: gallery thumbs
  document.querySelectorAll('.thumbs button').forEach(b => b.addEventListener('click', () => {
    document.querySelectorAll('.thumbs button').forEach(x => x.setAttribute('aria-pressed', x === b));
    const img = document.getElementById('main-img'); img.removeAttribute('srcset'); img.src = b.dataset.src; img.alt = b.dataset.alt;
  }));

  // Product: size buttons set the variant id
  const sizes = document.querySelector('[data-sizes]');
  if (sizes) {
    const input = document.querySelector('[data-variant-input]');
    const buy = document.querySelector('[data-buy]');
    sizes.addEventListener('click', e => {
      const b = e.target.closest('button[data-variant]'); if (!b || b.disabled) return;
      sizes.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', x === b));
      input.value = b.dataset.variant;
      document.querySelectorAll('[data-price]').forEach(p => { if (b.dataset.price) p.textContent = b.dataset.price; });
      if (buy) { buy.disabled = false; buy.textContent = 'Preorder · ' + b.textContent.trim(); }
    });
  }
  if (document.querySelector('.sticky-buy')) document.body.classList.add('has-sticky');
})();
