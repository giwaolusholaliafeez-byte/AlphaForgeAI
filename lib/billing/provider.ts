import type { SubscriptionPlan } from './types';

export interface CheckoutRequest { email: string; plan: SubscriptionPlan; callbackUrl: string; }
export interface CheckoutResponse { authorizationUrl: string; reference: string; }

export interface BillingProvider {
  initializeCheckout(request: CheckoutRequest): Promise<CheckoutResponse>;
  verifyTransaction(reference: string): Promise<{ reference: string; customerCode?: string; subscriptionCode?: string }>;
}
