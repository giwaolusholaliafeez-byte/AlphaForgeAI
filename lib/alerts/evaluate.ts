import { createClient } from "@/lib/supabase/server";
import { getAssetDetail } from "@/lib/market-data/asset-details";

/**
 * Evaluates a user's active alerts against current live prices and marks any
 * that have crossed their threshold as triggered. There is no push/email
 * delivery — this only updates stored state, checked whenever it's called
 * (e.g. on Alerts page load).
 */
export async function evaluateActiveAlerts(userId: string) {
  const supabase = await createClient();

  const { data: alerts } = await supabase
    .from("market_alerts")
    .select("id,asset_type,asset_id,condition,target")
    .eq("user_id", userId)
    .eq("status", "active");

  if (!alerts || alerts.length === 0) return { triggered: 0 };

  let triggeredCount = 0;

  for (const alert of alerts) {
    const detail = await getAssetDetail(alert.asset_type, alert.asset_id).catch(() => null);
    const price = detail?.data?.price;
    if (price === null || price === undefined || !Number.isFinite(price)) continue;

    const target = Number(alert.target);
    const hit = alert.condition === "above" ? price >= target : price <= target;

    if (hit) {
      await supabase
        .from("market_alerts")
        .update({ status: "triggered", triggered_at: new Date().toISOString(), trigger_price: price })
        .eq("id", alert.id)
        .eq("user_id", userId);
      triggeredCount += 1;
    }
  }

  return { triggered: triggeredCount };
}
