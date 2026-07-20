-- RLS Repair for portfolio_holdings table
-- Run this in Supabase SQL Editor if addHolding fails with permission errors

-- Drop existing policies for portfolio_holdings
DROP POLICY IF EXISTS "Users can view own holdings" ON public.portfolio_holdings;
DROP POLICY IF EXISTS "Users can insert own holdings" ON public.portfolio_holdings;
DROP POLICY IF EXISTS "Users can update own holdings" ON public.portfolio_holdings;
DROP POLICY IF EXISTS "Users can delete own holdings" ON public.portfolio_holdings;

-- Create SELECT policy
CREATE POLICY "Users can view own holdings"
    ON public.portfolio_holdings
    FOR SELECT
    USING (auth.uid() = user_id);

-- Create INSERT policy with portfolio ownership check
CREATE POLICY "Users can insert own holdings"
    ON public.portfolio_holdings
    FOR INSERT
    WITH CHECK (
        auth.uid() = user_id
        AND EXISTS (
            SELECT 1 
            FROM public.portfolios 
            WHERE portfolios.id = portfolio_id 
            AND portfolios.user_id = auth.uid()
        )
    );

-- Create UPDATE policy
CREATE POLICY "Users can update own holdings"
    ON public.portfolio_holdings
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Create DELETE policy
CREATE POLICY "Users can delete own holdings"
    ON public.portfolio_holdings
    FOR DELETE
    USING (auth.uid() = user_id);

-- Verify RLS is enabled
ALTER TABLE public.portfolio_holdings ENABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT ALL ON public.portfolio_holdings TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;
