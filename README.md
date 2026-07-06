# Papa Fils na Mama Fils Shop — Website

A complete, production-ready business website for **Papa Fils na Mama Fils Shop**, a family-run
fashion, bedding, curtains and travel-luggage shop at Byumba Market, Rwanda.

Built with **plain HTML5, CSS3 and JavaScript (ES6+) only** — no backend, no database, no build
step. All dynamic data (products, bookings, orders, reviews, messages, portfolio, business info)
lives in `localStorage`, seeded on first load from the data bundled in `js/modules/seed-data.js`.

## Running it

There is nothing to build or install. Two ways to view the site:

1. **Double-click `index.html`** — it will open and work fully in your browser.
2. **Or serve it locally** (recommended, avoids any browser file:// quirks):
   ```bash
   cd site
   python3 -m http.server 8080
   # then open http://localhost:8080
   ```

The site needs an internet connection only to load Google Fonts and the Font Awesome icon set
from their public CDNs (`fonts.googleapis.com`, `cdnjs.cloudflare.com`). Everything else — all
data, all logic — runs completely offline.

## Admin Panel

Go to `admin/login.html`.

- **Username:** `admin`
- **Password:** `byumba2026`

From the dashboard you can manage Products, Bookings, Orders, Reviews, Portfolio, Messages and
Business Settings, and view basic statistics. Credentials can be changed from the Settings tab.
A "Reset All Data" button in Settings restores the original demo data if you want to start over.

> **Security note:** this login is a client-side convenience for a no-backend demo project. The
> username/password are stored in `localStorage` and checked in the browser — this is **not**
> secure for a real deployment handling sensitive data. For production use with real customer
> data, a proper backend with server-side authentication is recommended.

## Folder structure

```
site/
├── index.html            Home
├── about.html             About Us
├── products.html          Product catalogue (search/filter/sort)
├── order.html             Cart-style order page
├── booking.html           Book a single product
├── portfolio.html         Completed work + video tour
├── reviews.html           Customer reviews
├── contact.html           Contact form, map, WhatsApp/call
├── 404.html                Not-found page
├── admin/
│   ├── login.html         Admin login
│   ├── dashboard.html     Admin dashboard shell
│   ├── auth.js             Login/session logic
│   └── dashboard.js        All admin CRUD logic
├── assets/
│   ├── images/             Optimised shop photos
│   └── videos/             Compressed hero loop + shop tour
├── css/
│   ├── style.css           Public site design system
│   └── admin.css           Admin dashboard styles
├── data/                   Human-readable JSON copies of the seed data
│   ├── products.json, categories.json, portfolio.json,
│   └── reviews.json, business.json, settings.json
├── js/
│   ├── modules/
│   │   ├── seed-data.js    JS copy of /data (used at runtime, avoids file:// CORS issues)
│   │   ├── utils.js        Formatting/validation helpers
│   │   ├── storage.js      localStorage wrapper
│   │   ├── store.js        Central data-access layer (all CRUD)
│   │   ├── ui.js           Shared navbar/footer/toasts/modals/theme
│   │   └── render.js        Shared card renderers
│   ├── home.js, products.js, order.js, booking.js,
│   ├── reviews.js, portfolio.js, contact.js
├── robots.txt
└── sitemap.xml
```

## Notes on the brief

The uploaded photos and video show a general household & fashion shop (tracksuits, dresses/coats,
bedsheets, towels, comforters, duvets, mattress protectors, curtains, floor mats and suitcases) —
not furniture. The site's content, categories and copy were built around what the shop actually
sells, while keeping every structural requirement from the brief (pages, booking/order system
without payment, admin CRUD panel, reviews, search/filter/sort, SEO tags, dark mode, etc.). The
Portfolio page's "coming soon" section lists categories the shop could realistically expand into.

## Performance & accessibility

- Images re-compressed and capped at 1280px, videos re-encoded and trimmed (44MB → ~3.5MB total).
- `loading="lazy"` on below-the-fold images, `preload="metadata"` on the tour video.
- No JS frameworks or heavy libraries — vanilla ES6 modules only.
- Semantic HTML, alt text on every image, visible focus states, `prefers-reduced-motion` respected.
- Meta tags, Open Graph, Twitter Cards, JSON-LD structured data, `robots.txt` and `sitemap.xml`.
"# papa-fils-shop" 
