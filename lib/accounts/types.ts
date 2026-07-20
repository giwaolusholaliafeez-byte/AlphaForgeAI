export type AccountMode = 'paper' | 'connected' | 'live';

export type UserType = 'investor' | 'trader' | 'exploring';

export interface PaperAccount {
  id: string;
  userId: string;
  currency: 'USD';
  startingBalance: number;
  cashBalance: number;
}

export interface PaperPosition {
  id: string;
  assetType: string;
  assetId: string;
  symbol: string;
  quantity: number;
  averageCost: number;
  realizedPnl: number;
}
