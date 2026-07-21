-- New additive migration. Run manually after 20260721_paper_completion.sql.
-- Do not rerun or edit the already-applied completion migration.
ALTER TABLE public.paper_accounts ADD COLUMN IF NOT EXISTS is_open BOOLEAN NOT NULL DEFAULT true;
UPDATE public.paper_accounts SET is_open = false WHERE cash_balance = 0 AND starting_balance = 100000;

CREATE OR REPLACE FUNCTION public.ensure_paper_account()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  INSERT INTO public.paper_accounts (user_id, starting_balance, cash_balance, is_open) VALUES (NEW.id, 100000, 0, false) ON CONFLICT (user_id) DO NOTHING;
  INSERT INTO public.subscriptions (user_id, provider, plan, status) VALUES (NEW.id, 'paystack', 'free', 'inactive') ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END; $$;
REVOKE EXECUTE ON FUNCTION public.ensure_paper_account() FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.open_paper_account()
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE account_row public.paper_accounts;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Unauthorized'; END IF;
  SELECT * INTO account_row FROM public.paper_accounts WHERE user_id = auth.uid() FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Paper account not found'; END IF;
  IF account_row.is_open THEN RETURN jsonb_build_object('opened', true, 'duplicate', true); END IF;
  UPDATE public.paper_accounts SET is_open = true, cash_balance = starting_balance, updated_at = now() WHERE id = account_row.id;
  INSERT INTO public.paper_equity_snapshots (user_id, paper_account_id, equity, cash_balance, invested_value, unrealized_pnl, realized_pnl, reason) VALUES (auth.uid(), account_row.id, account_row.starting_balance, account_row.starting_balance, 0, 0, 0, 'reset');
  RETURN jsonb_build_object('opened', true, 'cash_balance', account_row.starting_balance);
END; $$;
REVOKE EXECUTE ON FUNCTION public.open_paper_account() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.open_paper_account() TO authenticated;

CREATE OR REPLACE FUNCTION public.execute_paper_market_order(
  p_client_order_id TEXT, p_asset_type TEXT, p_asset_id TEXT,
  p_symbol TEXT, p_side TEXT, p_quantity NUMERIC, p_execution_price NUMERIC
) RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE account public.paper_accounts; position public.paper_positions; order_row public.paper_orders; gross NUMERIC; new_cash NUMERIC; realized NUMERIC := 0;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Unauthorized'; END IF;
  IF p_client_order_id IS NULL OR p_asset_type NOT IN ('stock','etf','crypto','fx','index_proxy') OR p_asset_id IS NULL OR p_symbol IS NULL OR p_side NOT IN ('buy','sell') OR p_quantity IS NULL OR p_execution_price IS NULL OR p_quantity <= 0 OR p_execution_price <= 0 THEN RAISE EXCEPTION 'Invalid paper order'; END IF;
  SELECT * INTO account FROM public.paper_accounts WHERE user_id = auth.uid() FOR UPDATE;
  IF NOT FOUND OR NOT account.is_open THEN RAISE EXCEPTION 'Paper account is not open'; END IF;
  SELECT * INTO order_row FROM public.paper_orders WHERE user_id = auth.uid() AND client_order_id = p_client_order_id;
  IF FOUND THEN RETURN jsonb_build_object('order_id', order_row.id, 'status', order_row.status, 'duplicate', true); END IF;
  gross := round(p_quantity * p_execution_price, 8);
  SELECT * INTO position FROM public.paper_positions WHERE paper_account_id = account.id AND asset_type = p_asset_type AND asset_id = p_asset_id FOR UPDATE;
  IF p_side = 'buy' THEN
    IF account.cash_balance < gross THEN RAISE EXCEPTION 'Insufficient buying power'; END IF;
    new_cash := account.cash_balance - gross;
    INSERT INTO public.paper_positions (user_id, paper_account_id, asset_type, asset_id, symbol, quantity, average_cost) VALUES (auth.uid(), account.id, p_asset_type, p_asset_id, p_symbol, p_quantity + COALESCE(position.quantity, 0), round((p_quantity * p_execution_price + COALESCE(position.quantity * position.average_cost, 0)) / (p_quantity + COALESCE(position.quantity, 0)), 8)) ON CONFLICT (paper_account_id, asset_type, asset_id) DO UPDATE SET quantity = EXCLUDED.quantity, average_cost = EXCLUDED.average_cost, updated_at = now();
  ELSE
    IF position.id IS NULL OR position.quantity < p_quantity THEN RAISE EXCEPTION 'Insufficient position quantity'; END IF;
    new_cash := account.cash_balance + gross; realized := round((p_execution_price - position.average_cost) * p_quantity, 8);
    IF position.quantity = p_quantity THEN DELETE FROM public.paper_positions WHERE id = position.id; ELSE UPDATE public.paper_positions SET quantity = quantity - p_quantity, realized_pnl = realized_pnl + realized, updated_at = now() WHERE id = position.id; END IF;
  END IF;
  UPDATE public.paper_accounts SET cash_balance = new_cash, updated_at = now() WHERE id = account.id;
  INSERT INTO public.paper_orders (user_id, paper_account_id, client_order_id, asset_type, asset_id, symbol, side, order_type, quantity, execution_price, gross_amount, realized_pnl, status, executed_at) VALUES (auth.uid(), account.id, p_client_order_id, p_asset_type, p_asset_id, p_symbol, p_side, 'market', p_quantity, p_execution_price, gross, realized, 'filled', now()) RETURNING * INTO order_row;
  INSERT INTO public.paper_transactions (user_id, paper_account_id, order_id, transaction_type, amount, cash_balance_after, realized_pnl) VALUES (auth.uid(), account.id, order_row.id, p_side, CASE WHEN p_side = 'buy' THEN -gross ELSE gross END, new_cash, realized);
  INSERT INTO public.paper_equity_snapshots (user_id, paper_account_id, equity, cash_balance, invested_value, unrealized_pnl, realized_pnl, reason) VALUES (auth.uid(), account.id, new_cash + COALESCE((SELECT sum(quantity * average_cost) FROM public.paper_positions WHERE paper_account_id = account.id), 0), new_cash, COALESCE((SELECT sum(quantity * average_cost) FROM public.paper_positions WHERE paper_account_id = account.id), 0), 0, COALESCE((SELECT sum(realized_pnl) FROM public.paper_orders WHERE paper_account_id = account.id AND status = 'filled'), 0), 'trade');
  INSERT INTO public.activity_events (user_id, mode, event_type, description, amount, metadata) VALUES (auth.uid(), 'paper', p_side || '_order', initcap(p_side) || ' ' || p_quantity || ' ' || p_symbol, gross, jsonb_build_object('realized_pnl', realized));
  RETURN jsonb_build_object('order_id', order_row.id, 'status', 'filled', 'cash_balance', new_cash, 'realized_pnl', realized);
END; $$;

CREATE OR REPLACE FUNCTION public.close_paper_position(p_asset_type TEXT, p_asset_id TEXT, p_symbol TEXT, p_execution_price NUMERIC)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE position public.paper_positions; result JSONB;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Unauthorized'; END IF;
  SELECT * INTO position FROM public.paper_positions WHERE user_id = auth.uid() AND asset_type = p_asset_type AND asset_id = p_asset_id FOR UPDATE;
  IF NOT FOUND OR position.quantity <= 0 THEN RAISE EXCEPTION 'Position not found'; END IF;
  result := public.execute_paper_market_order(gen_random_uuid()::TEXT, p_asset_type, p_asset_id, p_symbol, 'sell', position.quantity, p_execution_price);
  RETURN result;
END; $$;
REVOKE EXECUTE ON FUNCTION public.close_paper_position(TEXT, TEXT, TEXT, NUMERIC) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.close_paper_position(TEXT, TEXT, TEXT, NUMERIC) TO authenticated;

CREATE OR REPLACE FUNCTION public.reset_paper_account()
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE account_row public.paper_accounts;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Unauthorized'; END IF;
  SELECT * INTO account_row FROM public.paper_accounts WHERE user_id = auth.uid() FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Paper account not found'; END IF;
  DELETE FROM public.paper_positions WHERE paper_account_id = account_row.id; DELETE FROM public.paper_orders WHERE paper_account_id = account_row.id; DELETE FROM public.paper_transactions WHERE paper_account_id = account_row.id;
  UPDATE public.paper_accounts SET is_open = true, starting_balance = 100000, cash_balance = 100000, updated_at = now() WHERE id = account_row.id;
  INSERT INTO public.paper_transactions (user_id, paper_account_id, transaction_type, amount, cash_balance_after, realized_pnl) VALUES (auth.uid(), account_row.id, 'reset', 100000, 100000, 0);
  INSERT INTO public.paper_equity_snapshots (user_id, paper_account_id, equity, cash_balance, invested_value, unrealized_pnl, realized_pnl, reason) VALUES (auth.uid(), account_row.id, 100000, 100000, 0, 0, 0, 'reset');
END; $$;
REVOKE EXECUTE ON FUNCTION public.reset_paper_account() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.reset_paper_account() TO authenticated;
