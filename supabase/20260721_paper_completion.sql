-- Additive paper-account completion migration. Review and run manually in Supabase.
ALTER TABLE public.paper_orders ADD COLUMN IF NOT EXISTS realized_pnl NUMERIC(20,8) NOT NULL DEFAULT 0;
ALTER TABLE public.paper_transactions ADD COLUMN IF NOT EXISTS realized_pnl NUMERIC(20,8) NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS public.paper_equity_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  paper_account_id UUID NOT NULL REFERENCES public.paper_accounts(id) ON DELETE CASCADE,
  equity NUMERIC(20,8) NOT NULL CHECK (equity >= 0),
  cash_balance NUMERIC(20,8) NOT NULL CHECK (cash_balance >= 0),
  invested_value NUMERIC(20,8) NOT NULL CHECK (invested_value >= 0),
  unrealized_pnl NUMERIC(20,8) NOT NULL DEFAULT 0,
  realized_pnl NUMERIC(20,8) NOT NULL DEFAULT 0,
  reason TEXT NOT NULL CHECK (reason IN ('trade', 'reset')),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_paper_equity_snapshots_account_recorded ON public.paper_equity_snapshots(paper_account_id, recorded_at ASC);
ALTER TABLE public.paper_equity_snapshots ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS paper_equity_snapshots_owner_select ON public.paper_equity_snapshots;
CREATE POLICY paper_equity_snapshots_owner_select ON public.paper_equity_snapshots FOR SELECT USING (auth.uid() = user_id);
REVOKE INSERT, UPDATE, DELETE ON public.paper_equity_snapshots FROM authenticated;
GRANT SELECT ON public.paper_equity_snapshots TO authenticated;

CREATE OR REPLACE FUNCTION public.execute_paper_market_order(
  p_client_order_id TEXT, p_asset_type TEXT, p_asset_id TEXT,
  p_symbol TEXT, p_side TEXT, p_quantity NUMERIC, p_execution_price NUMERIC
) RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  v_user_id UUID := auth.uid();
  account public.paper_accounts;
  position public.paper_positions;
  order_row public.paper_orders;
  gross NUMERIC;
  new_cash NUMERIC;
  new_quantity NUMERIC;
  new_avg NUMERIC;
  realized NUMERIC := 0;
  invested NUMERIC := 0;
  total_realized NUMERIC := 0;
BEGIN
  IF v_user_id IS NULL THEN RAISE EXCEPTION 'Unauthorized'; END IF;
  IF p_client_order_id IS NULL OR p_asset_type NOT IN ('stock','etf','crypto') OR p_asset_id IS NULL OR p_symbol IS NULL OR p_side NOT IN ('buy','sell') OR p_quantity IS NULL OR p_execution_price IS NULL OR p_quantity <= 0 OR p_execution_price <= 0 OR p_quantity != p_quantity OR p_execution_price != p_execution_price THEN RAISE EXCEPTION 'Invalid paper order'; END IF;
  SELECT * INTO account FROM public.paper_accounts WHERE user_id = v_user_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Paper account not found'; END IF;
  SELECT * INTO order_row FROM public.paper_orders WHERE user_id = v_user_id AND client_order_id = p_client_order_id;
  IF FOUND THEN RETURN jsonb_build_object('order_id', order_row.id, 'status', order_row.status, 'duplicate', true); END IF;
  gross := round(p_quantity * p_execution_price, 8);
  SELECT * INTO position FROM public.paper_positions WHERE paper_account_id = account.id AND asset_type = p_asset_type AND asset_id = p_asset_id FOR UPDATE;
  IF p_side = 'buy' THEN
    IF account.cash_balance < gross THEN RAISE EXCEPTION 'Insufficient buying power'; END IF;
    new_cash := account.cash_balance - gross;
    new_quantity := p_quantity + COALESCE(position.quantity, 0);
    new_avg := round((p_quantity * p_execution_price + COALESCE(position.quantity * position.average_cost, 0)) / new_quantity, 8);
    INSERT INTO public.paper_positions (user_id, paper_account_id, asset_type, asset_id, symbol, quantity, average_cost)
      VALUES (v_user_id, account.id, p_asset_type, p_asset_id, p_symbol, new_quantity, new_avg)
      ON CONFLICT (paper_account_id, asset_type, asset_id) DO UPDATE SET quantity = EXCLUDED.quantity, average_cost = EXCLUDED.average_cost, updated_at = now();
  ELSE
    IF position.id IS NULL OR position.quantity < p_quantity THEN RAISE EXCEPTION 'Insufficient position quantity'; END IF;
    new_cash := account.cash_balance + gross;
    realized := round((p_execution_price - position.average_cost) * p_quantity, 8);
    IF position.quantity = p_quantity THEN DELETE FROM public.paper_positions WHERE id = position.id;
    ELSE UPDATE public.paper_positions SET quantity = quantity - p_quantity, realized_pnl = realized_pnl + realized, updated_at = now() WHERE id = position.id; END IF;
  END IF;
  UPDATE public.paper_accounts SET cash_balance = new_cash, updated_at = now() WHERE id = account.id;
  INSERT INTO public.paper_orders (user_id, paper_account_id, client_order_id, asset_type, asset_id, symbol, side, order_type, quantity, execution_price, gross_amount, realized_pnl, status, executed_at)
    VALUES (v_user_id, account.id, p_client_order_id, p_asset_type, p_asset_id, p_symbol, p_side, 'market', p_quantity, p_execution_price, gross, realized, 'filled', now()) RETURNING * INTO order_row;
  INSERT INTO public.paper_transactions (user_id, paper_account_id, order_id, transaction_type, amount, cash_balance_after, realized_pnl)
    VALUES (v_user_id, account.id, order_row.id, p_side, CASE WHEN p_side = 'buy' THEN -gross ELSE gross END, new_cash, realized);
  SELECT COALESCE(sum(quantity * average_cost), 0) INTO invested FROM public.paper_positions WHERE paper_account_id = account.id;
  SELECT COALESCE(sum(realized_pnl), 0) INTO total_realized FROM public.paper_orders WHERE paper_account_id = account.id AND status = 'filled';
  INSERT INTO public.paper_equity_snapshots (user_id, paper_account_id, equity, cash_balance, invested_value, unrealized_pnl, realized_pnl, reason)
    VALUES (v_user_id, account.id, new_cash + invested, new_cash, invested, 0, total_realized, 'trade');
  INSERT INTO public.activity_events (user_id, mode, event_type, description, amount, metadata)
    VALUES (v_user_id, 'paper', p_side || '_order', initcap(p_side) || ' ' || p_quantity || ' ' || p_symbol, gross, jsonb_build_object('realized_pnl', realized));
  RETURN jsonb_build_object('order_id', order_row.id, 'status', 'filled', 'cash_balance', new_cash, 'realized_pnl', realized);
END; $$;

CREATE OR REPLACE FUNCTION public.reset_paper_account()
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE account_row public.paper_accounts;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Unauthorized'; END IF;
  SELECT * INTO account_row FROM public.paper_accounts WHERE user_id = auth.uid() FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Paper account not found'; END IF;
  DELETE FROM public.paper_positions WHERE paper_account_id = account_row.id;
  DELETE FROM public.paper_orders WHERE paper_account_id = account_row.id;
  DELETE FROM public.paper_transactions WHERE paper_account_id = account_row.id;
  UPDATE public.paper_accounts SET cash_balance = starting_balance, updated_at = now() WHERE id = account_row.id;
  INSERT INTO public.paper_transactions (user_id, paper_account_id, transaction_type, amount, cash_balance_after, realized_pnl) VALUES (auth.uid(), account_row.id, 'reset', account_row.starting_balance, account_row.starting_balance, 0);
  INSERT INTO public.paper_equity_snapshots (user_id, paper_account_id, equity, cash_balance, invested_value, unrealized_pnl, realized_pnl, reason) VALUES (auth.uid(), account_row.id, account_row.starting_balance, account_row.starting_balance, 0, 0, 0, 'reset');
END; $$;

REVOKE EXECUTE ON FUNCTION public.execute_paper_market_order(TEXT, TEXT, TEXT, TEXT, TEXT, NUMERIC, NUMERIC) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.execute_paper_market_order(TEXT, TEXT, TEXT, TEXT, TEXT, NUMERIC, NUMERIC) TO authenticated;
REVOKE EXECUTE ON FUNCTION public.reset_paper_account() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.reset_paper_account() TO authenticated;
