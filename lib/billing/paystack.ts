import type { BillingProvider, CheckoutRequest, CheckoutResponse } from './provider';

const PAYSTACK_URL = 'https://api.paystack.co';

function secretKey(): string {
  const value = process.env.PAYSTACK_SECRET_KEY;
  if (!value) throw new Error('Paystack is not configured');
  return value;
}

export class PaystackProvider implements BillingProvider {
  async initializeCheckout(request: CheckoutRequest): Promise<CheckoutResponse> {
    const planCode = request.plan === 'pro' ? request.interval === 'annual' ? process.env.PAYSTACK_PRO_ANNUAL_PLAN_CODE : process.env.PAYSTACK_PRO_MONTHLY_PLAN_CODE : undefined;
    if (!planCode) throw new Error('Paystack Pro plan is not configured');
    const response = await fetch(`${PAYSTACK_URL}/transaction/initialize`, { method: 'POST', headers: { Authorization: `Bearer ${secretKey()}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ email: request.email, plan: planCode, callback_url: request.callbackUrl }) });
    const payload: unknown = await response.json();
    if (!response.ok || !isRecord(payload) || !isRecord(payload.data) || typeof payload.data.authorization_url !== 'string' || typeof payload.data.reference !== 'string') throw new Error('Unable to initialize Paystack checkout');
    return { authorizationUrl: payload.data.authorization_url, reference: payload.data.reference };
  }

  async getPlan(planCode: string): Promise<{ name: string; amount: number; interval: string; currency: string } | null> {
    try {
      const response = await fetch(`${PAYSTACK_URL}/plan/${encodeURIComponent(planCode)}`, {
        headers: { Authorization: `Bearer ${secretKey()}` },
        next: { revalidate: 3600 },
      });
      const payload: unknown = await response.json();
      if (!response.ok || !isRecord(payload) || !isRecord(payload.data)) return null;
      const { name, amount, interval, currency } = payload.data;
      if (typeof amount !== 'number' || typeof name !== 'string' || typeof interval !== 'string' || typeof currency !== 'string') return null;
      return { name, amount, interval, currency };
    } catch {
      return null;
    }
  }

  async verifyTransaction(reference: string) {
    const response = await fetch(`${PAYSTACK_URL}/transaction/verify/${encodeURIComponent(reference)}`, { headers: { Authorization: `Bearer ${secretKey()}` } });
    const payload: unknown = await response.json();
    if (!response.ok || !isRecord(payload) || !isRecord(payload.data) || payload.data.status !== 'success') throw new Error('Paystack transaction could not be verified');
    return { reference, customerCode: isRecord(payload.data.customer) && typeof payload.data.customer.customer_code === 'string' ? payload.data.customer.customer_code : undefined, subscriptionCode: typeof payload.data.subscription === 'string' ? payload.data.subscription : undefined, emailToken: typeof payload.data.email_token === 'string' ? payload.data.email_token : undefined };
  }

  async cancelSubscription(subscriptionCode: string, emailToken: string): Promise<void> {
    const response = await fetch(`${PAYSTACK_URL}/subscription/disable`, { method: 'POST', headers: { Authorization: `Bearer ${secretKey()}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ code: subscriptionCode, token: emailToken }) });
    if (!response.ok) throw new Error('Paystack could not cancel the subscription');
  }
}

function isRecord(value: unknown): value is Record<string, unknown> { return typeof value === 'object' && value !== null; }
