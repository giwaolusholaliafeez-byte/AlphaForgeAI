-- AlphaForge financial platform foundation. Additive migration: no existing tables are removed.
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DO $$ BEGIN
  CREATE TYPE public.account_mode AS ENUM ('paper', 'connected', 'live');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE public.user_type AS ENUM ('investor', 'trader', 'exploring');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_type public.user_type,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS user_type public.user_type;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY profiles_owner_all ON public.profiles FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (provider IN ('paystack')),
  plan TEXT NOT NULL CHECK (plan IN ('free', 'pro')) DEFAULT 'free',
  status TEXT NOT NULL CHECK (status IN ('active', 'non_renewing', 'cancelled', 'past_due', 'inactive')) DEFAULT 'inactive',
  customer_code TEXT,
  subscription_code TEXT,
  provider_email_token TEXT,
  provider_reference TEXT UNIQUE,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.paper_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  currency TEXT NOT NULL DEFAULT 'USD' CHECK (currency = 'USD'),
  starting_balance NUMERIC(20,8) NOT NULL DEFAULT 100000 CHECK (starting_balance > 0),
  cash_balance NUMERIC(20,8) NOT NULL DEFAULT 100000 CHECK (cash_balance >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.paper_positions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  paper_account_id UUID NOT NULL REFERENCES public.paper_accounts(id) ON DELETE CASCADE,
  asset_type TEXT NOT NULL CHECK (asset_type IN ('stock', 'etf', 'crypto', 'fx', 'index_proxy')),
  asset_id TEXT NOT NULL,
  symbol TEXT NOT NULL,
  quantity NUMERIC(20,8) NOT NULL CHECK (quantity > 0),
  average_cost NUMERIC(20,8) NOT NULL CHECK (average_cost >= 0),
  realized_pnl NUMERIC(20,8) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (paper_account_id, asset_type, asset_id)
);

CREATE TABLE IF NOT EXISTS public.paper_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  paper_account_id UUID NOT NULL REFERENCES public.paper_accounts(id) ON DELETE CASCADE,
  client_order_id TEXT NOT NULL,
  asset_type TEXT NOT NULL CHECK (asset_type IN ('stock', 'etf', 'crypto', 'fx', 'index_proxy')),
  asset_id TEXT NOT NULL,
  symbol TEXT NOT NULL,
  side TEXT NOT NULL CHECK (side IN ('buy', 'sell')),
  order_type TEXT NOT NULL CHECK (order_type = 'market'),
  quantity NUMERIC(20,8) NOT NULL CHECK (quantity > 0),
  execution_price NUMERIC(20,8) NOT NULL CHECK (execution_price > 0),
  gross_amount NUMERIC(20,8) NOT NULL CHECK (gross_amount > 0),
  status TEXT NOT NULL CHECK (status IN ('pending', 'filled', 'rejected')),
  rejection_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  executed_at TIMESTAMPTZ,
  UNIQUE (user_id, client_order_id)
);

CREATE TABLE IF NOT EXISTS public.paper_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  paper_account_id UUID NOT NULL REFERENCES public.paper_accounts(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.paper_orders(id) ON DELETE SET NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('deposit', 'buy', 'sell', 'reset')),
  amount NUMERIC(20,8) NOT NULL,
  cash_balance_after NUMERIC(20,8) NOT NULL CHECK (cash_balance_after >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.broker_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (provider IN ('snaptrade')),
  provider_user_id TEXT,
  provider_connection_id TEXT,
  institution_name TEXT,
  status TEXT NOT NULL CHECK (status IN ('pending', 'connected', 'error', 'revoked')) DEFAULT 'pending',
  last_synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, provider, provider_connection_id)
);

CREATE TABLE IF NOT EXISTS public.broker_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  connection_id UUID NOT NULL REFERENCES public.broker_connections(id) ON DELETE CASCADE,
  provider_account_id TEXT NOT NULL,
  name TEXT NOT NULL,
  masked_number TEXT,
  account_type TEXT,
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (connection_id, provider_account_id)
);

CREATE TABLE IF NOT EXISTS public.activity_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mode public.account_mode NOT NULL,
  event_type TEXT NOT NULL,
  description TEXT NOT NULL,
  amount NUMERIC(20,8),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_paper_orders_account_created ON public.paper_orders(paper_account_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_paper_transactions_account_created ON public.paper_transactions(paper_account_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_paper_positions_account ON public.paper_positions(paper_account_id);
CREATE INDEX IF NOT EXISTS idx_broker_connections_user ON public.broker_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_broker_accounts_user ON public.broker_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_events_user_occurred ON public.activity_events(user_id, occurred_at DESC);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paper_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paper_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paper_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paper_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.broker_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.broker_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY subscriptions_owner_select ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS paper_accounts_owner_all ON public.paper_accounts;
CREATE POLICY paper_accounts_owner_select ON public.paper_accounts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY paper_positions_owner_select ON public.paper_positions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY paper_orders_owner_select ON public.paper_orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY paper_transactions_owner_select ON public.paper_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY broker_connections_owner_all ON public.broker_connections FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY broker_accounts_owner_select ON public.broker_accounts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY activity_events_owner_select ON public.activity_events FOR SELECT USING (auth.uid() = user_id);

REVOKE INSERT, UPDATE, DELETE ON public.paper_accounts FROM authenticated;
GRANT SELECT ON public.paper_accounts TO authenticated;

CREATE OR REPLACE FUNCTION public.ensure_paper_account()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  INSERT INTO public.paper_accounts (user_id) VALUES (NEW.id) ON CONFLICT (user_id) DO NOTHING;
  INSERT INTO public.subscriptions (user_id, provider, plan, status)
    VALUES (NEW.id, 'paystack', 'free', 'inactive') ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS on_auth_user_financial_setup ON auth.users;
CREATE TRIGGER on_auth_user_financial_setup AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.ensure_paper_account();

-- Idempotent backfill for users created before this migration. Existing demo data is untouched.
INSERT INTO public.profiles (user_id)
  SELECT id FROM auth.users ON CONFLICT (user_id) DO NOTHING;
INSERT INTO public.paper_accounts (user_id)
  SELECT id FROM auth.users ON CONFLICT (user_id) DO NOTHING;
INSERT INTO public.subscriptions (user_id, provider, plan, status)
  SELECT id, 'paystack', 'free', 'inactive' FROM auth.users ON CONFLICT (user_id) DO NOTHING;

REVOKE EXECUTE ON FUNCTION public.ensure_paper_account() FROM PUBLIC, anon, authenticated;

DROP FUNCTION IF EXISTS public.execute_paper_market_order(UUID, TEXT, TEXT, TEXT, TEXT, TEXT, NUMERIC, NUMERIC);
CREATE OR REPLACE FUNCTION public.execute_paper_market_order(
  p_client_order_id TEXT, p_asset_type TEXT, p_asset_id TEXT,
  p_symbol TEXT, p_side TEXT, p_quantity NUMERIC, p_execution_price NUMERIC
) RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  v_user_id UUID := auth.uid();
  account public.paper_accounts;
  position public.paper_positions;
  order_row public.paper_orders;
  gross NUMERIC := p_quantity * p_execution_price;
  new_cash NUMERIC;
  new_quantity NUMERIC;
  new_avg NUMERIC;
BEGIN
  IF v_user_id IS NULL THEN RAISE EXCEPTION 'Unauthorized'; END IF;
  IF p_client_order_id IS NULL OR p_quantity <= 0 OR p_execution_price <= 0
     OR p_side NOT IN ('buy', 'sell') THEN RAISE EXCEPTION 'Invalid paper order'; END IF;
  SELECT * INTO account FROM public.paper_accounts WHERE user_id = v_user_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Paper account not found'; END IF;
  SELECT * INTO order_row FROM public.paper_orders WHERE user_id = v_user_id AND client_order_id = p_client_order_id;
  IF FOUND THEN RETURN jsonb_build_object('order_id', order_row.id, 'status', order_row.status, 'duplicate', true); END IF;
  SELECT * INTO position FROM public.paper_positions WHERE paper_account_id = account.id AND asset_type = p_asset_type AND asset_id = p_asset_id FOR UPDATE;
  IF p_side = 'buy' THEN
    IF account.cash_balance < gross THEN RAISE EXCEPTION 'Insufficient buying power'; END IF;
    new_cash := account.cash_balance - gross;
    new_quantity := p_quantity + COALESCE(position.quantity, 0);
    new_avg := (p_quantity * p_execution_price + COALESCE(position.quantity * position.average_cost, 0)) / new_quantity;
    INSERT INTO public.paper_positions (user_id, paper_account_id, asset_type, asset_id, symbol, quantity, average_cost)
      VALUES (v_user_id, account.id, p_asset_type, p_asset_id, p_symbol, new_quantity, new_avg)
      ON CONFLICT (paper_account_id, asset_type, asset_id) DO UPDATE SET quantity = EXCLUDED.quantity, average_cost = EXCLUDED.average_cost, updated_at = now();
  ELSE
    IF COALESCE(position.quantity, 0) < p_quantity THEN RAISE EXCEPTION 'Insufficient position quantity'; END IF;
    new_cash := account.cash_balance + gross;
    IF position.quantity = p_quantity THEN DELETE FROM public.paper_positions WHERE id = position.id;
    ELSE UPDATE public.paper_positions SET quantity = quantity - p_quantity, realized_pnl = realized_pnl + ((p_execution_price - average_cost) * p_quantity), updated_at = now() WHERE id = position.id; END IF;
  END IF;
  UPDATE public.paper_accounts SET cash_balance = new_cash, updated_at = now() WHERE id = account.id;
  INSERT INTO public.paper_orders (user_id, paper_account_id, client_order_id, asset_type, asset_id, symbol, side, order_type, quantity, execution_price, gross_amount, status, executed_at)
    VALUES (v_user_id, account.id, p_client_order_id, p_asset_type, p_asset_id, p_symbol, p_side, 'market', p_quantity, p_execution_price, gross, 'filled', now()) RETURNING * INTO order_row;
  INSERT INTO public.paper_transactions (user_id, paper_account_id, order_id, transaction_type, amount, cash_balance_after)
    VALUES (v_user_id, account.id, order_row.id, p_side, CASE WHEN p_side = 'buy' THEN -gross ELSE gross END, new_cash);
  INSERT INTO public.activity_events (user_id, mode, event_type, description, amount)
    VALUES (v_user_id, 'paper', p_side || '_order', initcap(p_side) || ' ' || p_quantity || ' ' || p_symbol, gross);
  RETURN jsonb_build_object('order_id', order_row.id, 'status', 'filled', 'cash_balance', new_cash);
END; $$;

DROP FUNCTION IF EXISTS public.reset_paper_account(UUID);
CREATE OR REPLACE FUNCTION public.reset_paper_account()
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE account_id UUID;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Unauthorized'; END IF;
  SELECT id INTO account_id FROM public.paper_accounts WHERE user_id = auth.uid() FOR UPDATE;
  IF account_id IS NULL THEN RAISE EXCEPTION 'Paper account not found'; END IF;
  DELETE FROM public.paper_positions WHERE paper_account_id = account_id;
  DELETE FROM public.paper_orders WHERE paper_account_id = account_id;
  DELETE FROM public.paper_transactions WHERE paper_account_id = account_id;
  UPDATE public.paper_accounts SET cash_balance = starting_balance, updated_at = now() WHERE id = account_id;
  INSERT INTO public.paper_transactions (user_id, paper_account_id, transaction_type, amount, cash_balance_after)
    SELECT auth.uid(), account_id, 'reset', starting_balance, starting_balance FROM public.paper_accounts WHERE id = account_id;
END; $$;

REVOKE EXECUTE ON FUNCTION public.execute_paper_market_order(TEXT, TEXT, TEXT, TEXT, TEXT, NUMERIC, NUMERIC) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.execute_paper_market_order(TEXT, TEXT, TEXT, TEXT, TEXT, NUMERIC, NUMERIC) TO authenticated;
REVOKE EXECUTE ON FUNCTION public.reset_paper_account() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.reset_paper_account() TO authenticated;
