# Session Log

## 2026-03-02

- Audited and fixed the homepage checkout UX and Stripe checkout route.
- Removed fragile remote font usage and switched the app to local/system font fallbacks.
- Added `systemd/cuckoo-app.service` and documented startup-on-boot steps.
- Built a branded `Cuckoo Block` landing page and dashboard with approved colors and `Saira` as the preferred font family.
- Added `public/logo.svg` and removed unused starter SVG assets from `public/`.
- Verified `/api/checkout` returns a JSON payload with `{ "url": "https://checkout.stripe.com/..." }`.
- Changed successful checkout redirect to `/dashboard?session_id={CHECKOUT_SESSION_ID}`.
- Gated `/dashboard` by verifying the Stripe Checkout session server-side before rendering access.
- Replaced placeholder contact text with `mailto:hello@cuckooblock.com`.
- Added copy stating users pay to get access to upgraded services.
- Added `engines.node` in `package.json` with `>=20 <23`.
- Added `STRIPE_PRICE_ID` to `.env.local`.
- Restarted the dev server after env changes and confirmed it runs on `http://localhost:3000`.
- Created `PROJECT_MEMORY.md` to preserve repo-local project context across sessions.

## Open items

- Update `app/api/checkout/route.ts` to use `STRIPE_PRICE_ID` instead of inline Stripe `price_data`.
- Add Stripe webhook handling tied to a persistent user/account record.
- Add real Terms and Privacy pages if those links should exist publicly.
- Configure GitHub authentication before pushing to `origin`.
