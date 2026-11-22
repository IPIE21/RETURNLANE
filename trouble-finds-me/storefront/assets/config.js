/*
 * TROUBLE FINDS ME — storefront configuration.
 * Everything that must be approved or connected before launch lives here.
 * Nothing on the site takes money while checkoutEnabled is false.
 */
window.TFM_CONFIG = {
  // ---- Commerce (Shopify) ----
  // Checkout stays OFF until product, pricing, manufacturing, delivery dates
  // and policies are approved. When on, the Preorder button sends the shopper
  // to Shopify's hosted checkout via a cart permalink. This site never sees card data.
  checkoutEnabled: false,
  shopifyDomain: "",            // e.g. "troublefindsme.myshopify.com"
  variantIds: { S: "", M: "", L: "", XL: "", "2XL": "" }, // Shopify variant IDs per size

  // ---- Product ----
  price: 42.00,                 // proposed; target range $39.99–$44.99, pending approval
  currency: "USD",
  sizes: ["S", "M", "L", "XL", "2XL"],
  preorderWindowDays: 10,       // proposed
  shipWindow: "",               // e.g. "Ships by March 20". Leave empty until the printer confirms a date.

  // ---- Email ----
  // POST endpoint for waitlist + contact (Shopify customer form, Klaviyo, Formspree, etc.).
  // Empty = demo mode: forms validate but nothing is sent or stored.
  waitlistEndpoint: "",
  contactEndpoint: "",
  contactEmail: "",             // e.g. "help@troublefindsme.com" once the domain exists
  instagram: "",                // e.g. "https://instagram.com/troublefindsme"
  tiktok: ""
};
