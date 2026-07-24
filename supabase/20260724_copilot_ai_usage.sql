-- Additive migration. Run manually after 20260721_product_completion.sql.
-- Extends consume_ai_usage to meter the portfolio copilot alongside research,
-- using the same free/pro limits. Existing 'research' behavior is unchanged.
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
  ELSIF p_feature NOT IN ('research', 'copilot') THEN v_limit := 0;
  END IF;
  SELECT count(*)::INTEGER INTO v_count FROM public.ai_usage_events
    WHERE user_id = v_user_id AND feature = p_feature AND created_at >= date_trunc('month', now());
  IF v_count >= v_limit THEN RETURN jsonb_build_object('allowed', false, 'used', v_count, 'limit', v_limit); END IF;
  INSERT INTO public.ai_usage_events (user_id, feature) VALUES (v_user_id, p_feature);
  RETURN jsonb_build_object('allowed', true, 'used', v_count + 1, 'limit', v_limit);
END; $$;
REVOKE EXECUTE ON FUNCTION public.consume_ai_usage(TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.consume_ai_usage(TEXT) TO authenticated;
