import type { Metadata } from "next";
import Link from "next/link";
import PricingPlans from "./PricingPlans";
import { getProPlanPricing } from "@/lib/billing/plans";
import { getUserSubscription } from "@/lib/billing/entitlements";

export const metadata: Metadata = {
  title: "Pricing | AlphaForge AI",
  description: "Choose the level of market intelligence you need — from core markets and simulated trading to deeper AI research and higher limits.",
};

export default async function PricingPage() {
  const [pricing, subscription] = await Promise.all([getProPlanPricing(), getUserSubscription()]);

  return (
    <main className="min-h-screen bg-[#0B0F1A] p-6 text-white">
      <div className="mx-auto max-w-6xl py-12 sm:py-20">
        <p className="text-xs uppercase tracking-[0.2em] text-[#00C2A8]">AlphaForge plans</p>
        <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
          Choose the level of market intelligence you need.
        </h1>
        <p className="mt-4 max-w-2xl text-[#A1A7B3]">
          Start with core markets and simulated trading. Upgrade through Paystack when you need deeper research,
          intelligence, and higher limits.
        </p>
        <PricingPlans pricing={pricing} currentPlan={subscription.plan} subscriptionStatus={subscription.status} />
        <p className="mt-8 text-center text-sm text-[#64748B]">
          Already have an account? <Link href="/sign-in" className="text-[#60A5FA] hover:underline">Sign in</Link>
        </p>
      </div>
    </main>
  );
}
