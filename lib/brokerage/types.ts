export interface BrokerageAccount { providerAccountId: string; name: string; maskedNumber?: string; accountType?: string; currency: string; status: string; }
export interface BrokeragePosition { providerAccountId: string; symbol: string; quantity: number; averageCost?: number; marketValue?: number; currency: string; }
export interface BrokerageBalance { providerAccountId: string; cash: number; portfolioValue: number; currency: string; }
export interface ConnectionLink { url: string; reference: string; }
