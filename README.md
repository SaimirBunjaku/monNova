# monNova Store

A modern e-commerce storefront built with **Next.js 15**, **React 19**, and **Tailwind CSS v4**. Product data is fetched from the [DummyJSON](https://dummyjson.com) API. Cart and favorites persist in the browser via `localStorage`.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (Turbopack) |
| `npm run build` | Production build |
| `npm start` | Serve production build |
| `npm run lint` | Run ESLint |

## Tech stack

- **Framework:** Next.js 15 App Router
- **UI:** React 19, Tailwind CSS v4
- **Fonts:** Plus Jakarta Sans (headings), Inter (body)
- **Data:** DummyJSON REST API (`cdn.dummyjson.com` for images)
- **State:** React Context + `localStorage` (cart, favorites)

## Features

### Shop (`/`)
- Full catalog loaded once and cached in memory
- Client-side search (title + brand), category chips, sort, pagination (28/page)
- URL-driven category filter (`?category=slug`)

### Product detail (`/products/[id]`)
- Server-fetched product, image gallery, specs, quantity stepper
- Add to cart, buy now, favorite toggle

### Cart
- Slide-out drawer, line items, quantity controls
- Add-to-cart toast with dismiss
- Free shipping on orders ≥ $50; flat $5.99 otherwise; 8% tax
- Persists under `localStorage` key `nova-cart`

### Favorites
- Heart toggle on cards and product pages
- Drawer + dedicated `/favorites` page
- Persists under `localStorage` key `nova-favorites`

### Checkout (`/checkout`)
- Contact & shipping form (mock — no payment processing)
- Order confirmation with generated order number
- Cart cleared after placing order

### Splash screen
- Branded intro on first load; respects `prefers-reduced-motion`

## Project structure

```
app/                  # Routes (listing, product detail, checkout, favorites)
components/           # UI components, providers, drawers
lib/                  # API client, listing cache, cart math, utilities
types/                # Product, cart, favorite types
```

## Data & limitations

- **No backend** — checkout is simulated; orders are not stored
- **No auth** — cart/favorites are per-browser only
- **Search** from the header on any page navigates to the shop with your query
- Requires network access to `dummyjson.com` and `cdn.dummyjson.com`

## QA checklist

### Build
- [ ] `npm run lint` passes
- [ ] `npm run build` succeeds

### Shop
- [ ] Products load; skeleton → grid
- [ ] Search filters by title/brand (debounced)
- [ ] Category chips + URL `?category=` work
- [ ] Sort reorders results
- [ ] Pagination scrolls to top on page change
- [ ] Empty/error states work

### Product detail
- [ ] Gallery, specs, add to cart, buy now
- [ ] Invalid ID → 404
- [ ] Favorite toggle

### Cart & favorites
- [ ] Drawer open/close (overlay, Escape, X)
- [ ] Persist after refresh
- [ ] Click product in drawer → navigates and closes drawer
- [ ] Cart toast dismiss (auto, hover pause, X)

### Checkout
- [ ] Empty cart state
- [ ] Form validation
- [ ] Place order → success screen; cart cleared

### Cross-flow
- [ ] Home → detail → cart → checkout → success
- [ ] Favorite → favorites page → add to cart

## License

Private — portfolio / demo project.
