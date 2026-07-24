import { PaystackProvider } from './paystack';

export interface ProPlanPricing {
  monthly: { amount: number; currency: string } | null;
  annual: { amount: number; currency: string } | null;
}

/**
 * Real prices pulled from the configured Paystack plans (amount is in the
 * smallest currency unit, e.g. kobo for NGN). Never hardcoded — if a plan
 * code is missing or Paystack is unreachable, the corresponding entry is
 * null and the UI must say pricing is unavailable rather than guess.
 */
export async function getProPlanPricing(): Promise<ProPlanPricing> {
  const monthlyCode = process.env.PAYSTACK_PRO_MONTHLY_PLAN_CODE;
  const annualCode = process.env.PAYSTACK_PRO_ANNUAL_PLAN_CODE;
  const provider = new PaystackProvider();

  const [monthlyPlan, annualPlan] = await Promise.all([
    monthlyCode ? provider.getPlan(monthlyCode) : Promise.resolve(null),
    annualCode ? provider.getPlan(annualCode) : Promise.resolve(null),
  ]);

  return {
    monthly: monthlyPlan ? { amount: monthlyPlan.amount, currency: monthlyPlan.currency } : null,
    annual: annualPlan ? { amount: annualPlan.amount, currency: annualPlan.currency } : null,
  };
}

export function formatPlanAmount(amountInSmallestUnit: number, currency: string): string {
  const major = amountInSmallestUnit / 100;
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(major);
  } catch {
    return `${currency} ${major.toLocaleString()}`;
  }
}
