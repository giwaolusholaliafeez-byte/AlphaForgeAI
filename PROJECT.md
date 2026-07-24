# AlphaForge AI

AlphaForge AI is an AI-powered market intelligence platform for traders, investors, and analysts. It combines live market data, AI-grounded research, portfolio analytics, watchlists, alerts, news intelligence, an earnings/IPO calendar, and risk-free paper trading in one workspace.

This document describes the **actual current implementation**. Anything not listed under "Current Implementation" does not exist in the codebase yet — see "Roadmap" for planned work.

---

## Current Implementation

### Stack (as actually used)

**Frontend / full-stack**
- Next.js 15 (App Router), React 19, TypeScript
- Tailwind CSS + Radix UI primitives (shadcn-style component layer in `components/ui`, including a `Dialog` primitive used by global search)
- Framer Motion for motion/transitions
- Recharts for charting (line + candlestick on asset pages)
- Zod for request validation
- `next/font/google` (Inter + JetBrains Mono)
- A small shared type scale and eyebrow-label system in `app/globals.css` (`.text-display`, `.text-section-title`, `.text-page-title`, `.label-eyebrow`, `.num`) used across the landing page and dashboard for consistent typography instead of one-off text sizes

**Backend / data**
- Supabase (Postgres + Auth + RLS) via `@supabase/ssr` and `@supabase/supabase-js` — there is no separate backend service (no FastAPI, no Redis, no Celery)
- Server-side API routes under `app/api/**` handle all writes and provider calls

**External integrations**
- **Finnhub** — stocks/ETFs, company news, earnings calendar, IPO calendar. `/stock/candle` (historical OHLC) returns 403 on the currently configured Finnhub tier; `getStockHistory` now falls back to Twelve Data automatically so stock charts still render real historical data (see `lib/market-data/asset-history.ts`)
- **CoinGecko** — crypto quotes and OHLC candles
- **Twelve Data** — forex intraday quotes and stock historical candle fallback (optional; forex falls back further to Frankfurter)
- **Frankfurter** — forex daily rates (no key required)
- **OpenAI Responses API** — AI research reports and the portfolio copilot (server-side only, key never reaches the client). **Not configured in this environment** — `.env.local` has no `OPENAI_API_KEY`/`OPENAI_MODEL`, so AI Research and Ask AlphaForge return a graceful "temporarily unavailable" error rather than a working answer. Code paths were verified by inspection and via the graceful-failure UI, not a live model response.
- **Paystack** — subscription billing (checkout + signature-verified webhook)
- **SnapTrade / Alpaca Broker API** — brokerage integration code exists but is not wired into any route; every method throws unless `LIVE_TRADING_ENABLED=true` **and** `LIVE_TRADING_MODE=sandbox`, and even then the methods are stubs pending the official SDK. Live trading is not reachable from the UI today.

There is no LangGraph, pgvector, Zustand, TanStack Query, or TradingView Lightweight Charts in this codebase, despite earlier drafts of this document describing them.

### Routes

**Public**
- `/` — landing page: layered hero composition (Ask AlphaForge conversation + watchlist ticker + alert chip), live-style dashboard preview, interactive platform showcase, ticker-style asset coverage, numbered process flow, provider-status trust panel, final CTA
- `/pricing`, `/sign-in`, `/sign-up`, `/forgot-password`, `/reset-password`

**Auth-gated (`/dashboard/**`, enforced by `middleware.ts`)**
- `/dashboard` — overview: live market strip, real portfolio card (with a working empty state for new users), AI Research teaser, top gainers/losers, watchlist preview, news preview
- `/dashboard/markets`, `/dashboard/markets/[assetType]/[assetId]` — market lists and asset detail with a working candlestick/line chart (Finnhub with Twelve Data fallback), timeframe/interval controls, statistics, company overview
- `/dashboard/portfolio` — create/select portfolios, holdings, valuation, allocation (portfolio creation is fully wired — see Known issues history below)
- `/dashboard/watchlist` — persistent watchlist (Supabase-backed), live price enrichment
- `/dashboard/alerts` — price alerts (above/below), plan-limited, **evaluated against live prices whenever the page loads** (`/api/alerts/evaluate`), with alert creation now using a real asset-search picker instead of free text
- `/dashboard/intelligence` — deterministic portfolio analytics (concentration, diversification, risk flags, scenario lab) plus an AI copilot ("Ask AlphaForge") that answers free-text questions grounded in that same computed context via OpenAI, rendered as a conversation thread
- `/dashboard/news` — live Finnhub news feed with a featured top story and a dense secondary list, grouped by category
- `/dashboard/calendar` — **new**: earnings and IPO calendar sourced from Finnhub (`/calendar/earnings`, `/calendar/ipo`), grouped by date, capped and sorted by company size per day, with a large-cap indicator. Finnhub's macro economic calendar (`/calendar/economic` — CPI/FOMC/NFP/GDP) returned a 403 on the configured tier and is not included; the page explicitly discloses this instead of fabricating macro data
- `/dashboard/research` — AI-generated research reports (OpenAI), saved per user, deep-linkable from any stock/ETF/crypto asset page ("Research Asset" button, hidden for forex/index-proxy assets which the research API doesn't support)
- `/dashboard/paper` — Supabase-backed paper trading account, orders, positions
- `/dashboard/accounts` — brokerage connection status (live trading shown as disabled/coming soon)
- `/dashboard/settings`, `/dashboard/settings/billing`, `/dashboard/settings/billing/manage` — profile, subscription management, Paystack billing
- `/dashboard/activity` — activity log
- `/onboarding` — first-run user type selection

### Authentication

Email/password auth via Supabase (`app/auth/actions.ts`, `app/auth/callback`, `app/auth/confirm`). Session refresh and route protection run through `middleware.ts` → `lib/supabase/middleware.ts`, which redirects unauthenticated users off `/dashboard/*` and authenticated users away from auth pages. There is no OAuth (Google/GitHub) and no 2FA implemented — a "Continue with Google" button previously existed on the sign-in page and called a real `signInWithOAuth` action, but the Google provider is not enabled in the Supabase project (`"Unsupported provider: provider is not enabled"`), so it was a non-functional button and has been removed along with the dead server action. Email confirmation is required for new signups; the Supabase project's Auth → URL Configuration redirect allow-list should include `${SITE_URL}/auth/callback` — during testing, a confirmation link resolved to the bare site root instead of `/auth/callback`, which looks like that allow-list is missing the callback path (see Known issues).

### Database (Supabase, additive migrations in `supabase/*.sql`)

Core tables: `profiles`, `portfolios`, `portfolio_holdings`, `watchlist_items`, `market_alerts`, `research_reports`, `ai_usage_events`, `subscriptions`, `paper_accounts`, `paper_orders`, `paper_positions`, `paper_snapshots`, `activity_events`. All are RLS-scoped to `auth.uid()`. Migrations are meant to be applied manually and in order (they are not run automatically).

A new migration, `supabase/20260724_alerts_fx_support.sql`, widens the `market_alerts.asset_type` CHECK constraint to include `'fx'` — the alerts API has always accepted forex alerts in its Zod schema, but the original database constraint only allowed `('stock','etf','crypto')`, so creating an alert on a forex pair would have failed at the database layer. **This migration has not been applied to the live database from this environment** (the `SUPABASE_SERVICE_ROLE_KEY` in `.env.local` is actually an anon-role key, not a service-role key — see Known issues) and needs to be run manually.

### Environment variables

See `.env.example`. Required for full functionality: Supabase URL/anon key/service role key, `FINNHUB_API_KEY`, `COINGECKO_DEMO_API_KEY`, `TWELVE_DATA_API_KEY` (now also used as a stock-history fallback, not just forex), `PAYSTACK_SECRET_KEY` + public key + plan codes, `OPENAI_API_KEY` + `OPENAI_MODEL`. Brokerage keys (`SNAPTRADE_*`, `ALPACA_BROKER_*`) plus `LIVE_TRADING_ENABLED`/`LIVE_TRADING_MODE` gate the (currently unreachable) live-trading code path — keep `LIVE_TRADING_ENABLED=false` in every environment until a real broker integration is built and reviewed.

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
| Landing page | Redesigned — layered hero composition, editorial section variety (ticker-style coverage list, numbered process, provider-status console) replacing repeated icon-card grids |
| Auth (sign up/in/out, sessions, protected routes) | Working. Fake Google OAuth button removed. Confirmation-email redirect path should be verified in the Supabase dashboard (see Known issues) |
| Dashboard overview | Working — live market data, real portfolio (empty-state bug fixed), live watchlist preview |
| Markets + asset detail + charts | Working — historical charts now render for stocks via a Twelve Data fallback (Finnhub's candle endpoint 403s on this tier) |
| Portfolio | Working — **portfolio creation was broken** (button set dead state, never rendered a form) and has been fixed; duplicate summary-card row removed |
| Watchlist | Working — persistent, live price enrichment, improved empty state |
| Alerts | Working — persisted, plan-limited, now evaluated against live prices on page load and marked "Triggered"; creation now uses a real asset-search picker instead of unvalidated free text; forex alert support requires the new migration to be applied |
| AI research reports | Implemented, deep-linkable from asset pages — **not live-testable in this environment** (no OpenAI credentials configured) |
| AI portfolio copilot ("Ask AlphaForge") | Implemented as a conversation thread — **not live-testable in this environment** (no OpenAI credentials configured) |
| News | Working (Finnhub) — redesigned with a featured story and denser list, explicitly not AI-generated |
| Earnings & IPO Calendar | **New** — real Finnhub data, macro economic calendar honestly excluded (requires a paid Finnhub tier) |
| Paper trading | Working (Supabase-backed sandbox account, real live prices used for fills) |
| Billing (Paystack) | Working — server-side checkout + HMAC-verified webhook, entitlements checked server-side |
| Brokerage (SnapTrade/Alpaca) | Not reachable from the UI; code is a guarded stub pending a real SDK integration |
| Settings/profile | Working (display name, subscription management) |

### Known issues / gaps

- **`SUPABASE_SERVICE_ROLE_KEY` in `.env.local` is actually an anon-role JWT**, not a service-role key (confirmed by decoding the token payload: `role: "anon"`). Any server-side code that expects elevated/service-role privileges from this variable will not get them. This should be replaced with the real service-role key from the Supabase dashboard.
- **Supabase Auth redirect allow-list**: following a real signup-confirmation link resolved to the bare site origin instead of `${SITE_URL}/auth/callback`, even though the app correctly requests the callback URL. This is consistent with Supabase silently falling back to the dashboard-configured Site URL when the requested redirect isn't in the allow-list. Add `${SITE_URL}/auth/callback` (and the production equivalent) to Supabase → Authentication → URL Configuration → Redirect URLs.
- `supabase/20260724_alerts_fx_support.sql` has not been applied to the live database from this environment (no valid service-role key available here) — apply it manually.
- Economic calendar covers earnings and IPOs only; macro events (CPI, FOMC, NFP, GDP) require a Finnhub plan above the one configured here.
- Brokerage connections are UI-visible as "coming soon" but have no working backend beyond guarded stubs — this is intentional until a funded/reviewed broker integration is scoped.
- AI Research and Ask AlphaForge could not be exercised against a live model in this environment; their request/response plumbing and error states were verified, but real answer quality/formatting has not been visually reviewed.
- No automated end-to-end/browser test suite is checked into the repo; this pass's validation used TypeScript, ESLint, `npm run build`, the `node --test` unit suite, a production `next start` smoke test, and extensive manual Playwright-driven browser testing against a real authenticated account (signup → email confirmation via a disposable inbox → onboarding → portfolio/watchlist/alert creation → asset detail → calendar) at desktop/laptop/tablet/mobile viewports.
- Legal pages (Privacy/Terms) are referenced conceptually in the footer copy but have no dedicated routes yet.

---

## Roadmap (not implemented)

- Macro economic calendar (CPI/PPI/FOMC/NFP/GDP) — would need a Finnhub plan upgrade or an alternative provider; the earnings/IPO calendar architecture in `lib/market-data/calendar.ts` is designed to extend cleanly if that becomes available.
- Real SnapTrade/Alpaca brokerage linking and live order execution, with an explicit, reviewed opt-in path.
- OAuth login (Google/GitHub — the Supabase project would need the Google provider enabled first) and two-factor authentication.
- Server-side/multi-turn conversation memory for Ask AlphaForge (currently each question is answered independently; the UI now shows a session-local thread, but the backend doesn't receive prior turns as context).
- PDF export for research reports.
- Dedicated Privacy/Terms/Risk-disclosure pages.
- Broader technical-indicator support (RSI/MACD) on charts and as alert conditions.
- Email/push delivery for triggered alerts (currently evaluated and surfaced in-app only).
