import type { TradingProvider } from './provider';
import type { TradingAccount, TradingOrder, TradingOrderRequest } from './types';

export class AlpacaBrokerProvider implements TradingProvider {
  private assertEnabled(): void {
    if (!liveTradingEnabled()) throw new Error('Live brokerage is not currently available');
    if (process.env.LIVE_TRADING_MODE !== 'sandbox') throw new Error('Live brokerage is fail-closed until sandbox mode is explicitly selected');
    if (!process.env.ALPACA_BROKER_API_KEY || !process.env.ALPACA_BROKER_API_SECRET) throw new Error('Alpaca sandbox is not configured');
  }
  async getAccount(): Promise<TradingAccount> { this.assertEnabled(); throw new Error('Alpaca Broker adapter requires the configured official SDK/API client'); }
  async previewOrder(_order: TradingOrderRequest): Promise<TradingOrder> { this.assertEnabled(); throw new Error('Live order preview is unavailable'); }
  async placeOrder(_order: TradingOrderRequest): Promise<TradingOrder> { this.assertEnabled(); throw new Error('Live order placement is unavailable'); }
  async cancelOrder(_orderId: string): Promise<TradingOrder> { this.assertEnabled(); throw new Error('Live order cancellation is unavailable'); }
  async getOrders(): Promise<TradingOrder[]> { this.assertEnabled(); throw new Error('Live order history is unavailable'); }
}

function liveTradingEnabled(): boolean { return process.env.LIVE_TRADING_ENABLED === 'true'; }
