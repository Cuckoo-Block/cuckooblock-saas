# Cuckoo Block Project Memory

## How to use this file

If the user says `remember`, `remind me`, or `remember our sessions`, read this file first, then read `SESSION_LOG.md`, and use both as the project memory for the current session.

This file is the persistent repo-local memory for the project. Update it when product direction, deployment, billing, branding, or workflow changes.

## Project

- Name: `Cuckoo Block`
- Repo path: `/home/admin/cuckoo-app`
- GitHub remote: `https://github.com/Cuckoo-Block/cuckooblock-vendors`
- Primary Vercel domain: `https://cuckooblock-vendors.vercel.app`

## Current product state

- App is a Next.js SaaS landing page with Stripe Checkout.
- Landing page branding uses `Cuckoo Block`.
- Main CTA sends users to `/api/checkout`.
- Successful checkout redirects to `/dashboard?session_id={CHECKOUT_SESSION_ID}`.
- `/dashboard` now verifies the Stripe Checkout session server-side before granting access.
- Customer-facing checkout errors are intentionally generic and trust-safe.

## Billing and env

- Required env vars currently present in `.env.local`:
  - `STRIPE_SECRET_KEY`
  - `NEXT_PUBLIC_BASE_URL`
  - `STRIPE_PRICE_ID`
- Stripe Price ID was provided by the user and should be used for the real paid product flow.
- Current checkout route still needs to be aligned with `STRIPE_PRICE_ID` if inline price data is no longer desired.

## Branding

- Official brand colors:
  - `#022e51`
  - `#ffffff`
  - `#034a83`
  - `#01121f`
  - `#ecebec`
  - `#0467b5`
- Approved header font: `Saira`
- Current theme and CTA styling were updated to match the approved palette.

## Content decisions already made

- Contact email on landing page: `hello@cuckooblock.com`
- Landing page should explicitly say users pay to get access to upgraded services.
- Landing page should feel legitimate and customer-ready, with trust cues around Stripe checkout.

## Repo and deployment notes

- Node version pinned in `package.json`:
  - `>=20 <23`
- Production build uses:
  - `next build --webpack`
- A `systemd` startup unit exists at:
  - `systemd/cuckoo-app.service`
- Startup service install still requires manual `sudo` on the machine.

## Recent commits

- `b53136a` `chore: pin node version for vercel`
- `0bf3a96` `launch: cuckoo block v1`
- `66dc934` `fix: homepage checkout UX + resilient base URL`

## Known gaps / next work

- Wire `STRIPE_PRICE_ID` into `app/api/checkout/route.ts` so checkout uses the real Stripe Price instead of inline price data.
- Add a Stripe webhook and persist payment state to a real user/account record.
- Replace placeholder legal text with real Terms/Privacy pages if needed.
- Configure GitHub auth locally before pushing over HTTPS.

## Working conventions

- When the user says `remember` or `remind me`, summarize this file first.
- Then read `SESSION_LOG.md` and summarize the most recent work and open items.
- Prefer concise, direct execution over long planning.
- Preserve the existing Cuckoo Block branding unless the user explicitly changes it.
- At the end of meaningful work sessions, append a short dated note to `SESSION_LOG.md`.
