# Sovereign — Enterprise UI (Investor Demo)

A standalone, **fully hardcoded** marketing mockup of the Sovereign enterprise
commodity-settlement dashboard. Built for fundraising demos — it shows investors
what the enterprise UI will look like.

> ⚠️ **This is not the real product.** There is no backend, no auth, no wallet
> connection, and no live agent. Every number, deal, document, and vessel
> position on screen is static demo data in `data/deals.ts`. The real Sovereign
> dashboard lives elsewhere and connects to a live agent.

## Stack

- **Next.js 16** (App Router, Turbopack)
- **React 19**
- **TypeScript 5**
- **Tailwind CSS v4** — CSS-first config via `@theme` in `app/globals.css`
  (there is no `tailwind.config.ts` in v4)
- **pnpm**
- Fonts: Cormorant Garamond + JetBrains Mono via `next/font/google`

## Requirements

- **Node.js ≥ 20.9** (enforced via the `engines` field in `package.json`;
  Next 16 requires it, and it tells Vercel which Node version to use)
- pnpm

## Run locally

```bash
cd sovereign-enterprise-ui
pnpm install
pnpm dev
```

Open <http://localhost:3000>.

### Routes

| Route        | What it shows                                                          |
| ------------ | ---------------------------------------------------------------------- |
| `/`          | Hero / landing for investors arriving from the pitch deck              |
| `/dashboard` | The main demo: stats, deals table, deal detail, New-deal modal, wallet |

### Things to click on `/dashboard`

- **Deal rows** — click any row to select it; the **Deal Detail** panel below
  updates (SP-2847 is selected by default, matching the design).
- **+ New deal** — opens a 4-step modal (counterparty → vessel → escrow/docs →
  review). "Create deal" fires a `Deal created · SP-2848 (demo)` toast and
  closes. It does **not** add a row — purely visual.
- **Connect wallet** — toggles to `Connected · lq1qx...8z2k` with a disconnect
  affordance. Purely visual.
- **Check status ↗** (settlement footer) — opens <https://liquid.network/> in a
  new tab.

## Build (Vercel-readiness gate)

```bash
pnpm build
```

Vercel runs this same command. It must succeed. All three routes prerender as
static content.

## Deploy to Vercel

1. Push this folder to its own GitHub repo.
2. In Vercel: **New Project → Import** the repo.
3. Framework preset: **Next.js** (auto-detected). Build command `pnpm build`,
   output handled automatically. No environment variables are needed.
4. Node version is taken from the `engines.node` field (`>=20.9.0`); Vercel will
   pick a compatible 20.x / 22.x / 24.x runtime.
5. Deploy. There is nothing else to configure — no secrets, no database.

## What's hardcoded (set expectations)

Everything. Specifically:

- The 4 stat cards, the 4 deal rows, and all deal-detail content live in
  `data/deals.ts`.
- The New-deal modal collects input but discards it; the success toast is faked.
- "Connect wallet" flips a local boolean.
- Vessel positions, zkPass proof hashes, and document sources are illustrative.

### Adding / editing deals mid-presentation

Append a new object to the `deals` array in `data/deals.ts` (the `Deal` type
documents every field). Bump `stats` if you want the headline numbers to match.
The table, selection, and detail panel are all driven from that one file.

## Project layout

```
app/
  layout.tsx          fonts + metadata
  globals.css         Tailwind v4 @theme design tokens + badge styles
  page.tsx            hero / landing
  dashboard/page.tsx  renders <Dashboard />
components/
  Dashboard.tsx       client: topbar, stats, table, state (select/modal/wallet/toast)
  DealDetail.tsx      progress timeline, document verification, vessel tracking, settlement
  NewDealModal.tsx    client: 4-step demo form
  ui.tsx              Badge + Cell helpers
data/
  deals.ts            all hardcoded demo data + types
```
