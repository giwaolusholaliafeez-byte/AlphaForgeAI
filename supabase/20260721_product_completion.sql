-- Additive product-completion migration. Review and run manually in Supabase.
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS display_name TEXT;
CREATE TABLE IF NOT EXISTS public.research_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  asset_type TEXT NOT NULL CHECK (asset_type IN ('stock', 'etf', 'crypto')),
  asset_id TEXT NOT NULL,
  symbol TEXT NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  report_json JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_research_reports_user_created ON public.research_reports(user_id, created_at DESC);
ALTER TABLE public.research_reports ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS research_reports_owner_select ON public.research_reports;
DROP POLICY IF EXISTS research_reports_owner_insert ON public.research_reports;
CREATE POLICY research_reports_owner_select ON public.research_reports FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY research_reports_owner_insert ON public.research_reports FOR INSERT WITH CHECK (auth.uid() = user_id);
REVOKE UPDATE, DELETE ON public.research_reports FROM authenticated;
GRANT SELECT, INSERT ON public.research_reports TO authenticated;

CREATE TABLE IF NOT EXISTS public.ai_usage_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  feature TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_ai_usage_user_feature_created ON public.ai_usage_events(user_id, feature, created_at DESC);
ALTER TABLE public.ai_usage_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS ai_usage_owner_select ON public.ai_usage_events;
CREATE POLICY ai_usage_owner_select ON public.ai_usage_events FOR SELECT USING (auth.uid() = user_id);
REVOKE INSERT, UPDATE, DELETE ON public.ai_usage_events FROM authenticated;
GRANT SELECT ON public.ai_usage_events TO authenticated;

CREATE OR REPLACE FUNCTION public.consume_ai_usage(p_feature TEXT)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_limit INTEGER := 5;
  v_count INTEGER;
  v_plan TEXT;
BEGIN
  IF v_user_id IS NULL THEN RAISE EXCEPTION 'Unauthorized'; END IF;
  SELECT plan INTO v_plan FROM public.subscriptions WHERE user_id = v_user_id;
  IF v_plan = 'pro' THEN v_limit := 100;
  ELSIF p_feature <> 'research' THEN v_limit := 0;
  END IF;
  SELECT count(*)::INTEGER INTO v_count FROM public.ai_usage_events
    WHERE user_id = v_user_id AND feature = p_feature AND created_at >= date_trunc('month', now());
  IF v_count >= v_limit THEN RETURN jsonb_build_object('allowed', false, 'used', v_count, 'limit', v_limit); END IF;
  INSERT INTO public.ai_usage_events (user_id, feature) VALUES (v_user_id, p_feature);
  RETURN jsonb_build_object('allowed', true, 'used', v_count + 1, 'limit', v_limit);
END; $$;
REVOKE EXECUTE ON FUNCTION public.consume_ai_usage(TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.consume_ai_usage(TEXT) TO authenticated;

CREATE TABLE IF NOT EXISTS public.watchlist_items (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE, asset_type TEXT NOT NULL CHECK (asset_type IN ('stock','etf','crypto')), asset_id TEXT NOT NULL, symbol TEXT NOT NULL, name TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT now(), UNIQUE(user_id, asset_type, asset_id));
CREATE INDEX IF NOT EXISTS idx_watchlist_items_user ON public.watchlist_items(user_id, created_at DESC);
ALTER TABLE public.watchlist_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS watchlist_items_owner_all ON public.watchlist_items;
CREATE POLICY watchlist_items_owner_all ON public.watchlist_items FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.market_alerts (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE, asset_type TEXT NOT NULL CHECK (asset_type IN ('stock','etf','crypto')), asset_id TEXT NOT NULL, symbol TEXT NOT NULL, condition TEXT NOT NULL CHECK (condition IN ('above','below')), target NUMERIC(20,8) NOT NULL CHECK (target > 0), status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','triggered','disabled')), triggered_at TIMESTAMPTZ, trigger_price NUMERIC(20,8), created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE INDEX IF NOT EXISTS idx_market_alerts_user_status ON public.market_alerts(user_id, status);
ALTER TABLE public.market_alerts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS market_alerts_owner_all ON public.market_alerts;
CREATE POLICY market_alerts_owner_all ON public.market_alerts FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
