export type SubscriptionPlan = 'free' | 'pro';
export type SubscriptionStatus = 'active' | 'non_renewing' | 'cancelled' | 'past_due' | 'inactive';

export interface Subscription {
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  subscriptionCode?: string | null;
}

export interface FeatureLimits {
  portfolioLimit: number | null;
  watchlistLimit: number | null;
  alertLimit: number | null;
  advancedResearch: boolean;
  exports: boolean;
}
