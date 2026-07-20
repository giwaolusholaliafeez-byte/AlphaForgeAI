-- RLS Repair for AlphaForgeAI Portfolio Tables
-- Run this if portfolio operations are blocked by RLS

-- Check if policies exist and recreate them if needed

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own portfolios" ON public.portfolios;
DROP POLICY IF EXISTS "Users can insert own portfolios" ON public.portfolios;
DROP POLICY IF EXISTS "Users can update own portfolios" ON public.portfolios;
DROP POLICY IF EXISTS "Users can delete own portfolios" ON public.portfolios;

DROP POLICY IF EXISTS "Users can view own holdings" ON public.portfolio_holdings;
DROP POLICY IF EXISTS "Users can insert own holdings" ON public.portfolio_holdings;
DROP POLICY IF EXISTS "Users can update own holdings" ON public.portfolio_holdings;
DROP POLICY IF EXISTS "Users can delete own holdings" ON public.portfolio_holdings;

-- Create policies for portfolios
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

-- Create policies for portfolio holdings
CREATE POLICY "Users can view own holdings"
    ON public.portfolio_holdings
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own holdings"
    ON public.portfolio_holdings
    FOR INSERT
    WITH CHECK (
        auth.uid() = user_id AND
        EXISTS (
            SELECT 1 FROM public.portfolios
            WHERE portfolios.id = portfolio_id
            AND portfolios.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update own holdings"
    ON public.portfolio_holdings
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own holdings"
    ON public.portfolio_holdings
    FOR DELETE
    USING (auth.uid() = user_id);

-- Verify RLS is enabled
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_holdings ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions
GRANT ALL ON public.portfolios TO authenticated;
GRANT ALL ON public.portfolio_holdings TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Verify the tables exist and have the correct structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'portfolios'
ORDER BY ordinal_position;

SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'portfolio_holdings'
ORDER BY ordinal_position;
