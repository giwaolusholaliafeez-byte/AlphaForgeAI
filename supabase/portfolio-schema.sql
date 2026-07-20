-- Portfolio Management Schema for AlphaForgeAI
-- Execute this in the Supabase SQL Editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Portfolios Table
CREATE TABLE IF NOT EXISTS public.portfolios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL CHECK (char_length(trim(name)) >= 2 AND char_length(trim(name)) <= 60),
    base_currency TEXT NOT NULL DEFAULT 'USD',
    cash_balance NUMERIC NOT NULL DEFAULT 0 CHECK (cash_balance >= 0),
    is_default BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Portfolio Holdings Table
CREATE TABLE IF NOT EXISTS public.portfolio_holdings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    portfolio_id UUID NOT NULL REFERENCES public.portfolios(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    asset_type TEXT NOT NULL CHECK (asset_type IN ('stock', 'etf', 'crypto', 'fx', 'index_proxy')),
    asset_id TEXT NOT NULL CHECK (char_length(trim(asset_id)) > 0),
    symbol TEXT NOT NULL CHECK (char_length(trim(symbol)) > 0),
    asset_name TEXT NOT NULL CHECK (char_length(trim(asset_name)) > 0),
    quantity NUMERIC NOT NULL CHECK (quantity > 0),
    average_cost NUMERIC NOT NULL CHECK (average_cost >= 0),
    acquired_at DATE NULL,
    notes TEXT NULL CHECK (notes IS NULL OR char_length(notes) <= 500),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(portfolio_id, asset_type, asset_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_portfolios_user_id ON public.portfolios(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_holdings_user_id ON public.portfolio_holdings(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_holdings_portfolio_id ON public.portfolio_holdings(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_holdings_asset_type ON public.portfolio_holdings(asset_type);
CREATE INDEX IF NOT EXISTS idx_portfolio_holdings_asset_id ON public.portfolio_holdings(asset_id);

-- Partial unique index to ensure only one default portfolio per user
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_default_portfolio 
    ON public.portfolios (user_id) 
    WHERE is_default = true;

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_portfolios_updated_at
    BEFORE UPDATE ON public.portfolios
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_portfolio_holdings_updated_at
    BEFORE UPDATE ON public.portfolio_holdings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_holdings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for portfolios
CREATE POLICY "Users can view own portfolios"
    ON public.portfolios
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own portfolios"
    ON public.portfolios
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own portfolios"
    ON public.portfolios
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own portfolios"
    ON public.portfolios
    FOR DELETE
    USING (auth.uid() = user_id);

-- RLS Policies for portfolio holdings
CREATE POLICY "Users can view own holdings"
    ON public.portfolio_holdings
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own holdings"
    ON public.portfolio_holdings
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own holdings"
    ON public.portfolio_holdings
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own holdings"
    ON public.portfolio_holdings
    FOR DELETE
    USING (auth.uid() = user_id);

-- Grant access to authenticated users
GRANT ALL ON public.portfolios TO authenticated;
GRANT ALL ON public.portfolio_holdings TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Create a function to ensure default portfolio exists
CREATE OR REPLACE FUNCTION public.ensure_default_portfolio()
RETURNS TRIGGER AS $$
BEGIN
    -- If this is the user's first portfolio, make it default
    IF NOT EXISTS (
        SELECT 1 FROM public.portfolios WHERE user_id = NEW.user_id AND id != NEW.id
    ) THEN
        NEW.is_default := true;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ensure_default_portfolio_trigger
    BEFORE INSERT ON public.portfolios
    FOR EACH ROW
    EXECUTE FUNCTION public.ensure_default_portfolio();
