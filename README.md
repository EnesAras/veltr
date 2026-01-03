# veltr

VELTR is a full-stack monorepo for the premium headphones experience (Storefront + Admin + Express API). Everything is wired together through shared data, auth, cart, and Stripe-ready checkout flows.

## Getting started

1. Install dependencies at the repo root:
   ```bash
   npm install
   ```
2. Copy `backend/.env.example` to `backend/.env` and populate the secrets (`JWT_SECRET`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, plus `FRONTEND_URL` if you run the storefront on a non-default port).
3. Start the monorepo (storefront, admin, and backend) in parallel:
   ```bash
   npm run dev
   ```

## Ports

- Storefront (Vite): http://localhost:5173
- Admin (Vite): http://localhost:5174
- Backend API: http://localhost:5001

Each service logs its URL on startup so you can confirm the ports before opening a browser.

## Features

- React + Vite storefront with product filtering, cart, checkout, premium hero rail, and editorial cards.
- Express backend with JWT auth, product catalog, cart persistence, Stripe session creation, webhook handling, and in-memory order history.
- Shared `shared/data/products.js` powers hero slides, featured cards, filters, and cart pricing to ensure every image matches the data source.

## Backend env variables

Required runtime variables for `backend/.env`:

```
PORT=5001
JWT_SECRET=veltr_dev_secret
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
FRONTEND_URL=http://localhost:5173
```

Use real Stripe keys when testing payments. Keep the webhook secret confidential and point Stripe’s webhook to `/api/webhooks/stripe` on the backend origin (e.g. `http://localhost:5001/api/webhooks/stripe`).
