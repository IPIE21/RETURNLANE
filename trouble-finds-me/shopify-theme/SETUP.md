# Put Trouble Finds Me on Shopify: step by step

About 45–60 minutes. You do the sign-ups and payments yourself. Never paste passwords into a chat.

**Files you need**
- `trouble-finds-me-theme.zip` (the theme)
- `products/shopify_products.csv` (the product)
- `products/images/` (the two concept images)

---

## 1. Create the store (10 min)
1. Go to shopify.com and start a free trial. Use your brand email, store name **Trouble Finds Me**.
2. Skip the setup quiz questions you don't need.
3. Your store is **password protected** during the trial. That's good: visitors see our custom "Coming soon" page with the waitlist form.

## 2. Upload the theme (5 min)
1. Admin → **Online Store → Themes** → **Add theme → Upload zip file** → choose `trouble-finds-me-theme.zip`.
2. On the uploaded theme click **⋯ → Publish**.

## 3. Add the product (10 min)
1. Admin → **Products → Import** → upload `shopify_products.csv`. It creates **Ride the Tiger Tee** as a **Draft** with sizes S–2XL at $42.00.
2. Open the product → **Media** → upload `1-back-concept.jpg` then `2-front-concept.jpg`. For alt text use "Ride the Tiger tee, back (concept artwork)" and "…front (concept artwork)".
3. Inventory per size is set to a starter cap (S 5, M 9, L 9, XL 5, 2XL 2 = 30). Change it to your approved run size. When a size hits 0 it shows as sold out.
4. Set status to **Active** once you're happy (it's still hidden behind the store password).

## 4. Create the collection (2 min)
Products → **Collections → Create**: title **Drop 001**, manual, add Ride the Tiger Tee.

## 5. Create the pages (10 min)
Online Store → **Pages → Add page**. For each, pick the **Theme template** on the right side:

| Page title | Template | Content box |
|---|---|---|
| Waitlist | `page.waitlist` | leave empty |
| Size Guide | `page.size-guide` | leave empty (edit rows in the theme editor) |
| FAQ | `page.faq` | leave empty (edit questions in the theme editor) |
| Contact | `page.contact` | optional intro line |
| Our Story | `page.about` | paste the story from `storefront/about.html` |

Keep the handles as `waitlist`, `size-guide`, `faq`, `contact`. The theme links to them.

## 6. Menus (5 min)
Online Store → **Navigation**
- **Main menu:** Drop 001 (collection) · Ride the Tiger (product) · Story · FAQ · Waitlist
- **Footer:** Drop 001 · Size guide · Waitlist · FAQ · Contact · Shipping policy · Refund policy

## 7. Policies (5 min)
Settings → **Policies**. Paste from `storefront/shipping-returns.html` into the **Refund** and **Shipping** policies, and use Shopify's generator for **Privacy** and **Terms**. Fill in your contact info.

## 8. Connect your domain (5 min + waiting for DNS)
Settings → **Domains → Connect existing domain** → type your domain → follow Shopify's steps. If your registrar is supported, it connects automatically. Otherwise Shopify shows two DNS records to add at your registrar:
- **A record** `@` → Shopify's IP (shown on screen)
- **CNAME** `www` → `shops.myshopify.com`

It can take up to 48 hours to work. Then set it as the **primary domain**.

## 9. Email (5 min)
- Waitlist signups go to **Customers**, subscribed to email marketing and tagged `waitlist`, `drop001`, and `size-M` etc.
- Install **Shopify Email** (free tier) → Automations → **Welcome new subscribers** → paste EM1 from `marketing/EMAILS.md`.
- Settings → Notifications → **Order confirmation**: add the preorder paragraph from `launch/PREORDER_SYSTEM.md`.

## 10. Theme settings
Online Store → Themes → **Customize** → ⚙ Theme settings:
- **Preorders → Preorders open:** keep **OFF**. While off, buy buttons go to the waitlist and checkout is hidden.
- **Ship window:** leave empty until the printer confirms a date.
- **Social media:** add your Instagram/TikTok links.

## 11. Before you open preorders (final approval)
- [ ] Real sample photos uploaded and "concept artwork" captions removed in the theme editor
- [ ] Size guide measured from the sample
- [ ] Ship window entered
- [ ] Shopify Payments set up (Settings → Payments), test order placed and refunded
- [ ] Pick a paid plan and **remove the store password** (Online Store → Preferences)
- [ ] Turn **Preorders open** ON

## Optional: auto-deploy from GitHub
Online Store → Themes → **Add theme → Connect from GitHub** → pick the repo and the `shopify-theme` branch (the theme files at the branch root). Every push then updates the theme.
