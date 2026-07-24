# AlphaForge AI

AlphaForge AI is an AI-powered market intelligence platform for traders, investors, and analysts. It combines live market data, AI-grounded research, portfolio analytics, watchlists, alerts, news intelligence, and risk-free paper trading in one workspace.

This document describes the **actual current implementation**. Anything not listed under "Current Implementation" does not exist in the codebase yet — see "Roadmap" for planned work.

---

## Current Implementation

### Stack (as actually used)

**Frontend / full-stack**
- Next.js 15 (App Router), React 19, TypeScript
- Tailwind CSS + Radix UI primitives (shadcn-style component layer in `components/ui`)
- Framer Motion for motion/transitions
- Recharts for charting
- Zod for request validation
- `next/font/google` (Inter + JetBrains Mono)

**Backend / data**
- Supabase (Postgres + Auth + RLS) via `@supabase/ssr` and `@supabase/supabase-js` — there is no separate backend service (no FastAPI, no Redis, no Celery)
- Server-side API routes under `app/api/**` handle all writes and provider calls

**External integrations**
- **Finnhub** — stocks/ETFs, company news
- **CoinGecko** — crypto quotes and OHLC candles
- **Twelve Data** — forex intraday quotes (optional; falls back to Frankfurter)
- **Frankfurter** — forex daily rates (no key required)
- **OpenAI Responses API** — AI research reports and the portfolio copilot (server-side only, key never reaches the client)
- **Paystack** — subscription billing (checkout + signature-verified webhook)
- **SnapTrade / Alpaca Broker API** — brokerage integration code exists but is not wired into any route; every method throws unless `LIVE_TRADING_ENABLED=true` **and** `LIVE_TRADING_MODE=sandbox`, and even then the methods are stubs pending the official SDK. Live trading is not reachable from the UI today.

There is no LangGraph, pgvector, Zustand, TanStack Query, or TradingView Lightweight Charts in this codebase, despite earlier drafts of this document describing them.

### Routes

**Public**
- `/` — landing page (revamped: hero, live-style dashboard preview, interactive platform showcase with 5 tabs, markets/capability overview, how-it-works, data & security section, final CTA)
- `/pricing`, `/sign-in`, `/sign-up`, `/forgot-password`, `/reset-password`

**Auth-gated (`/dashboard/**`, enforced by `middleware.ts`)**
- `/dashboard` — overview: live market strip, portfolio card, AI insight slot, top gainers/losers, watchlist preview (live prices), news preview
- `/dashboard/markets`, `/dashboard/markets/[assetType]/[assetId]` — market lists and asset detail with charting
- `/dashboard/portfolio` — holdings, valuation, allocation
- `/dashboard/watchlist` — persistent watchlist (Supabase-backed), live price enrichment
- `/dashboard/alerts` — price alerts (above/below), plan-limited
- `/dashboard/intelligence` — deterministic portfolio analytics (concentration, diversification, risk flags) plus an AI copilot ("Ask AlphaForge") that answers free-text questions grounded in that same computed context via OpenAI
- `/dashboard/news` — live Finnhub news feed
- `/dashboard/research` — AI-generated research reports (OpenAI), saved per user
- `/dashboard/paper` — Supabase-backed paper trading account, orders, positions
- `/dashboard/accounts` — brokerage connection status (live trading shown as disabled/coming soon)
- `/dashboard/settings`, `/dashboard/settings/billing`, `/dashboard/settings/billing/manage` — profile, subscription management, Paystack billing
- `/dashboard/activity` — activity log
- `/onboarding` — first-run user type selection

### Authentication

Email/password auth via Supabase (`app/auth/actions.ts`, `app/auth/callback`, `app/auth/confirm`). Session refresh and route protection run through `middleware.ts` → `lib/supabase/middleware.ts`, which redirects unauthenticated users off `/dashboard/*` and authenticated users away from auth pages. There is no OAuth (Google/GitHub) and no 2FA implemented, despite earlier drafts of this document claiming otherwise.

### Database (Supabase, additive migrations in `supabase/*.sql`)

Core tables: `profiles`, `portfolios`, `portfolio_holdings`, `watchlist_items`, `market_alerts`, `research_reports`, `ai_usage_events`, `subscriptions`, `paper_accounts`, `paper_orders`, `paper_positions`, `paper_snapshots`, `activity_events`. All are RLS-scoped to `auth.uid()`. Migrations are meant to be applied manually and in order (they are not run automatically).

### Environment variables

See `.env.example`. Required for full functionality: Supabase URL/anon key/service role key, `FINNHUB_API_KEY`, `COINGECKO_DEMO_API_KEY`, `TWELVE_DATA_API_KEY` (optional), `PAYSTACK_SECRET_KEY` + public key + plan codes, `OPENAI_API_KEY` + `OPENAI_MODEL`. Brokerage keys (`SNAPTRADE_*`, `ALPACA_BROKER_*`) plus `LIVE_TRADING_ENABLED`/`LIVE_TRADING_MODE` gate the (currently unreachable) live-trading code path — keep `LIVE_TRADING_ENABLED=false` in every environment until a real broker integration is built and reviewed.

### Commands

```
npm run dev      # local dev server
npm run build    # production build (also type-checks and lints via next build)
npm run lint     # eslint --max-warnings=0
npm test         # node --test over lib/**/*.test.ts
```

### Feature status

| Feature | Status |
| --- | --- |
| Landing page | Revamped — real product-preview visuals, no fabricated stats/testimonials |
| Auth (sign up/in/out, sessions, protected routes) | Working |
| Dashboard overview | Working — live market data, real portfolio, live watchlist preview |
| Markets + asset detail + charts | Working (Finnhub/CoinGecko/Twelve Data/Frankfurter) |
| Portfolio | Working (Supabase-backed) |
| Watchlist | Working — persistent, live price enrichment on both the dashboard widget and the full watchlist page |
| Alerts | Working — persisted, plan-limited, deep-linked from asset pages |
| AI research reports | Working — real OpenAI call, server-side only, saved reports |
| AI portfolio copilot ("Ask AlphaForge") | Working — real OpenAI call grounded in computed portfolio context, metered usage |
| News | Working (Finnhub), explicitly not AI-generated |
| Paper trading | Working (Supabase-backed sandbox account, real live prices used for fills) |
| Billing (Paystack) | Working — server-side checkout + HMAC-verified webhook, entitlements checked server-side |
| Brokerage (SnapTrade/Alpaca) | Not reachable from the UI; code is a guarded stub pending a real SDK integration |
| Economic calendar | **Missing** — no route, data layer, or provider wired up |
| Settings/profile | Working (display name, subscription management) |

### Known issues / gaps

- Economic calendar does not exist yet (see Roadmap).
- Brokerage connections are UI-visible as "coming soon" but have no working backend beyond guarded stubs — this is intentional until a funded/reviewed broker integration is scoped.
- No automated end-to-end/browser test suite; validation for this pass was TypeScript, ESLint, `npm run build`, the `node --test` unit suite, and manual route smoke-checks (curl) against a local dev server. Dashboard flows that require a live Supabase session were not exercised in a real browser in this pass — no browser automation tool was available in this environment.
- Legal pages (Privacy/Terms) are referenced conceptually in the footer copy but have no dedicated routes yet.

---

## Roadmap (not implemented)

- Economic calendar (calendar of CPI/PPI/FOMC/NFP/GDP/earnings events with AI context) — would need a real data provider (e.g. Finnhub's economic calendar endpoint) behind a service layer, plus a new dashboard route.
- Real SnapTrade/Alpaca brokerage linking and live order execution, with an explicit, reviewed opt-in path.
- OAuth login (Google/GitHub) and two-factor authentication.
- PDF export for research reports.
- Dedicated Privacy/Terms/Risk-disclosure pages.
- Broader technical-indicator support (RSI/MACD) on charts and as alert conditions.
