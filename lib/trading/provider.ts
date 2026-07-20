import type { TradingAccount, TradingOrder, TradingOrderRequest } from './types';

export interface TradingProvider {
  getAccount(): Promise<TradingAccount>;
  previewOrder(order: TradingOrderRequest): Promise<TradingOrder>;
  placeOrder(order: TradingOrderRequest): Promise<TradingOrder>;
  cancelOrder(orderId: string): Promise<TradingOrder>;
  getOrders(): Promise<TradingOrder[]>;
}

export function liveTradingEnabled(): boolean { return process.env.LIVE_TRADING_ENABLED === 'true'; }
