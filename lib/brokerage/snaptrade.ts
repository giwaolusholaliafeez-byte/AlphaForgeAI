import type { BrokerageProvider } from './provider';
import type { BrokerageAccount, BrokerageBalance, BrokeragePosition, ConnectionLink } from './types';

export class SnapTradeProvider implements BrokerageProvider {
  private configured(): void {
    if (!process.env.SNAPTRADE_CLIENT_ID || !process.env.SNAPTRADE_CONSUMER_KEY) throw new Error('Connected brokerage is not configured');
  }
  async createConnectionLink(_userId: string, _callbackUrl: string): Promise<ConnectionLink> { this.configured(); throw new Error('SnapTrade connection flow is not enabled until its SDK/API version is configured'); }
  async listAccounts(_connectionReference: string): Promise<BrokerageAccount[]> { this.configured(); throw new Error('SnapTrade account sync is not enabled'); }
  async getBalances(_providerAccountId: string): Promise<BrokerageBalance> { this.configured(); throw new Error('SnapTrade balance sync is not enabled'); }
  async getPositions(_providerAccountId: string): Promise<BrokeragePosition[]> { this.configured(); throw new Error('SnapTrade position sync is not enabled'); }
}
