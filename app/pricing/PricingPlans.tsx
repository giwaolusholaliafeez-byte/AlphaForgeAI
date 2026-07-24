"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPlanAmount } from "@/lib/billing/format";
import type { ProPlanPricing } from "@/lib/billing/plans";
import type { SubscriptionPlan, SubscriptionStatus } from "@/lib/billing/types";

const freeFeatures = ["Provider-backed market access", "Paper trading with $100,000 virtual capital", "1 portfolio", "20 watchlist assets", "5 active alerts", "Basic research"];
const proFeatures = ["Everything in Free", "Advanced AI research and history", "Portfolio Intelligence", "Scenario Lab", "Unlimited portfolios, watchlist, and alerts", "Advanced analytics and exports"];

interface PricingPlansProps {
  pricing: ProPlanPricing;
  currentPlan: SubscriptionPlan;
  subscriptionStatus: SubscriptionStatus;
}

export default function PricingPlans({ pricing, currentPlan, subscriptionStatus }: PricingPlansProps) {
  const [interval, setInterval] = useState<"monthly" | "annual">("monthly");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isActivePro = currentPlan === "pro" && subscriptionStatus === "active";

  const monthly = pricing.monthly;
  const annual = pricing.annual;
  const annualMonthlyEquivalent = annual ? annual.amount / 12 : null;
  const savingsPercent =
    monthly && annualMonthlyEquivalent !== null && annualMonthlyEquivalent < monthly.amount
      ? Math.round((1 - annualMonthlyEquivalent / monthly.amount) * 100)
      : null;

  const priceLabel = (() => {
    if (interval === "monthly") {
      return monthly ? `${formatPlanAmount(monthly.amount, monthly.currency)}/mo` : "Pricing unavailable";
    }
    return annual ? `${formatPlanAmount(annual.amount, annual.currency)}/yr` : "Pricing unavailable";
  })();

  async function upgrade() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/billing/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ plan: "pro", interval }) });
      const data = await response.json();
      if (response.status === 401) { window.location.href = "/sign-in?next=/pricing"; return; }
      if (!response.ok || typeof data.authorizationUrl !== "string") throw new Error(data.error ?? "Checkout is currently unavailable.");
      window.location.href = data.authorizationUrl;
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Checkout is currently unavailable.");
      setLoading(false);
    }
  }

  return (
    <div className="mt-10">
      <div className="mx-auto flex w-fit rounded-lg border border-white/[0.08] bg-white/[0.02] p-1">
        <button type="button" onClick={() => setInterval("monthly")} className={`rounded-md px-4 py-2 text-sm ${interval === "monthly" ? "bg-[#2563EB] text-white" : "text-[#A1A7B3]"}`}>Monthly</button>
        <button type="button" onClick={() => setInterval("annual")} className={`relative rounded-md px-4 py-2 text-sm ${interval === "annual" ? "bg-[#2563EB] text-white" : "text-[#A1A7B3]"}`}>
          Annual
          {savingsPercent !== null && savingsPercent > 0 && (
            <span className="ml-1.5 rounded-full bg-[#00C2A8]/15 px-1.5 py-0.5 text-[10px] font-medium text-[#00C2A8]">Save {savingsPercent}%</span>
          )}
        </button>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <Plan
          name="Free"
          price="$0"
          description="For exploring markets and learning with virtual capital."
          features={freeFeatures}
          isCurrent={currentPlan === "free"}
        />
        <Plan
          name="Pro"
          price={priceLabel}
          priceSuffix={interval === "annual" && annualMonthlyEquivalent !== null && annual ? `≈ ${formatPlanAmount(annualMonthlyEquivalent, annual.currency)}/mo billed annually` : undefined}
          description="For deeper research and portfolio-aware intelligence."
          features={proFeatures}
          featured
          isCurrent={isActivePro}
          recommended
          action={
            isActivePro ? (
              <Button type="button" disabled className="mt-7 w-full bg-white/[0.06] text-[#A1A7B3]">Current plan</Button>
            ) : (
              <Button type="button" onClick={upgrade} disabled={loading || (!monthly && !annual)} className="mt-7 w-full bg-[#00C2A8] text-[#0B0F1A] hover:bg-[#00C2A8]/90">
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {loading ? "Opening secure checkout..." : currentPlan === "pro" ? "Reactivate Pro" : "Upgrade to Pro"}
              </Button>
            )
          }
        />
      </div>
      {error && <p className="mt-4 text-center text-sm text-red-300">{error}</p>}
      <p className="mt-5 text-center text-xs text-[#64748B]">
        Payments are processed by Paystack. AlphaForge activates Pro only after server-side verification/webhook confirmation.
      </p>
    </div>
  );
}

function Plan({
  name,
  price,
  priceSuffix,
  description,
  features,
  featured = false,
  isCurrent = false,
  recommended = false,
  action,
}: {
  name: string;
  price: string;
  priceSuffix?: string;
  description: string;
  features: string[];
  featured?: boolean;
  isCurrent?: boolean;
  recommended?: boolean;
  action?: React.ReactNode;
}) {
  return (
    <section className={`relative rounded-2xl border p-7 ${featured ? "border-[#2563EB] bg-[#2563EB]/10 shadow-xl shadow-[#2563EB]/10" : "border-white/[0.08] bg-white/[0.02]"}`}>
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-2xl font-medium">{name}</h2>
        <div className="flex items-center gap-2">
          {isCurrent && <span className="rounded-full border border-white/[0.15] bg-white/[0.06] px-2 py-1 text-xs uppercase tracking-wider text-white">Current plan</span>}
          {recommended && !isCurrent && <span className="rounded-full bg-[#2563EB]/20 px-2 py-1 text-xs uppercase tracking-wider text-[#60A5FA]">Recommended</span>}
        </div>
      </div>
      <p className="mt-5 text-xl text-white">{price}</p>
      {priceSuffix && <p className="mt-1 text-xs text-[#8B93A3]">{priceSuffix}</p>}
      <p className="mt-2 min-h-12 text-sm text-[#A1A7B3]">{description}</p>
      <ul className="mt-7 space-y-3 text-sm text-[#CBD5E1]">
        {features.map((feature) => (
          <li key={feature} className="flex gap-2">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#00C2A8]" />
            {feature}
          </li>
        ))}
      </ul>
      {action}
    </section>
  );
}
