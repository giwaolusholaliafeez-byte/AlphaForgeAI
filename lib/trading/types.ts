export type TradingOrderStatus = 'pending' | 'accepted' | 'partially_filled' | 'filled' | 'cancelled' | 'rejected';
export interface TradingAccount { id: string; status: string; buyingPower: number; cash: number; currency: string; }
export interface TradingOrderRequest { symbol: string; side: 'buy' | 'sell'; quantity: number; orderType: 'market' | 'limit'; clientOrderId: string; }
export interface TradingOrder { id: string; status: TradingOrderStatus; symbol: string; side: 'buy' | 'sell'; quantity: number; providerStatus: string; }
