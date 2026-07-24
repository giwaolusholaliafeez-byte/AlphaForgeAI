-- The alerts API has always accepted assetType 'fx' (see app/api/alerts/route.ts),
-- but the original market_alerts CHECK constraint only allowed
-- ('stock','etf','crypto'), so creating a forex price alert failed at the
-- database layer. This widens the constraint to match what the API supports.
ALTER TABLE public.market_alerts DROP CONSTRAINT IF EXISTS market_alerts_asset_type_check;
ALTER TABLE public.market_alerts ADD CONSTRAINT market_alerts_asset_type_check
  CHECK (asset_type IN ('stock', 'etf', 'crypto', 'fx'));
