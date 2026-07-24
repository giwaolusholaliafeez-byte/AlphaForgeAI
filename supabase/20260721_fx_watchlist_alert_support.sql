-- Additive migration. Run manually after the existing product and paper migrations.
-- Existing RLS, ownership policies, limits, and uniqueness constraints are preserved.
ALTER TABLE public.watchlist_items DROP CONSTRAINT IF EXISTS watchlist_items_asset_type_check;
ALTER TABLE public.watchlist_items ADD CONSTRAINT watchlist_items_asset_type_check CHECK (asset_type IN ('stock', 'etf', 'crypto', 'fx'));
ALTER TABLE public.market_alerts DROP CONSTRAINT IF EXISTS market_alerts_asset_type_check;
ALTER TABLE public.market_alerts ADD CONSTRAINT market_alerts_asset_type_check CHECK (asset_type IN ('stock', 'etf', 'crypto', 'fx'));
