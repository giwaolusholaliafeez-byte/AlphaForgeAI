import type { BrokerageAccount, BrokerageBalance, BrokeragePosition, ConnectionLink } from './types';

export interface BrokerageProvider {
  createConnectionLink(userId: string, callbackUrl: string): Promise<ConnectionLink>;
  listAccounts(connectionReference: string): Promise<BrokerageAccount[]>;
  getBalances(providerAccountId: string): Promise<BrokerageBalance>;
  getPositions(providerAccountId: string): Promise<BrokeragePosition[]>;
}
