import { 
  StockDetail, 
  CryptoDetail, 
  AssetDetail,
  AssetDetailResponse,
  RecommendationTrend,
  AssetNewsItem 
} from './types';
import { FinnhubClient } from './finnhub';
import { CoinGeckoClient } from './coingecko';
import { validateStockSymbol, validateCryptoId } from './asset-validation';

export async function getStockDetail(symbol: string): Promise<AssetDetailResponse> {
  const apiKey = process.env.FINNHUB_API_KEY;
  
  if (!apiKey) {
    return {
      data: null,
      error: 'FINNHUB_API_KEY is not configured',
      source: 'finnhub',
      lastUpdated: null,
      isDelayed: true,
      isConfigured: false,
    };
  }

  try {
    const client = new FinnhubClient(apiKey);
    
    // Fetch quote and profile in parallel
    const [quote, profile] = await Promise.all([
      client.getQuote(symbol),
      client.getProfile(symbol).catch(() => undefined),
    ]);

    // Check if we got valid data
    if (!quote || quote.c === undefined || quote.c === null) {
      return {
        data: null,
        error: `No data available for ${symbol}`,
        source: 'finnhub',
        lastUpdated: null,
        isDelayed: true,
        isConfigured: true,
      };
    }

    const now = new Date().toISOString();
    
    const detail: StockDetail = {
      id: symbol,
      symbol: symbol.toUpperCase(),
      name: profile?.name || symbol,
      type: symbol.startsWith('SPY') || symbol.startsWith('QQQ') || symbol.startsWith('DIA') || symbol.startsWith('VOO') ? 'etf' : 'stock',
      price: quote.c,
      change: quote.d,
      changePercent: quote.dp,
      currency: profile?.currency || 'USD',
      marketCap: profile?.marketCapitalization || null,
      volume: null,
      logo: profile?.logo || null,
      exchange: profile?.exchange || null,
      industry: profile?.finnhubIndustry || null,
      country: profile?.country || null,
      lastUpdated: quote.t ? new Date(quote.t * 1000).toISOString() : now,
      source: 'finnhub',
      open: quote.o || null,
      dayHigh: quote.h || null,
      dayLow: quote.l || null,
      week52High: null,
      week52Low: null,
      pe: null,
      eps: null,
      beta: null,
      dividendYield: null,
      revenueGrowth: null,
      profitMargin: null,
      description: null,
      website: profile?.weburl || null,
      ipoDate: profile?.ipo || null,
      allTimeHigh: null,
      allTimeLow: null,
      athDate: null,
      atlDate: null,
      circulatingSupply: null,
      totalSupply: null,
      maxSupply: null,
      fullyDilutedValuation: null,
      categories: [],
      recommendation: [],
    };

    return {
      data: detail,
      error: null,
      source: 'finnhub',
      lastUpdated: now,
      isDelayed: true,
      isConfigured: true,
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Failed to fetch stock data',
      source: 'finnhub',
      lastUpdated: null,
      isDelayed: true,
      isConfigured: true,
    };
  }
}

export async function getCryptoDetail(coinId: string): Promise<AssetDetailResponse> {
  const apiKey = process.env.COINGECKO_DEMO_API_KEY;
  
  if (!apiKey) {
    return {
      data: null,
      error: 'COINGECKO_DEMO_API_KEY is not configured',
      source: 'coingecko',
      lastUpdated: null,
      isDelayed: true,
      isConfigured: false,
    };
  }

  try {
    const client = new CoinGeckoClient();
    
    // Fetch market data
    const marketData = await client.getMarketData([coinId]);
    
    if (!marketData || marketData.length === 0) {
      return {
        data: null,
        error: `No data available for ${coinId}`,
        source: 'coingecko',
        lastUpdated: null,
        isDelayed: true,
        isConfigured: true,
      };
    }

    const data = marketData[0];
    const now = new Date().toISOString();

    const detail: CryptoDetail = {
      homepage: null,
      id: data.id,
      symbol: data.symbol.toUpperCase(),
      name: data.name,
      type: 'crypto',
      price: data.current_price || null,
      change: data.price_change_percentage_24h || null,
      changePercent: data.price_change_percentage_24h || null,
      currency: 'USD',
      marketCap: data.market_cap || null,
      volume: data.total_volume || null,
      logo: data.image || null,
      rank: data.market_cap_rank || null,
      exchange: 'Crypto Market',
      lastUpdated: data.last_updated || now,
      source: 'coingecko',
      description: null,
      website: null,
      ipoDate: null,
      industry: null,
      country: null,
      allTimeHigh: null,
      allTimeLow: null,
      athDate: null,
      atlDate: null,
      circulatingSupply: null,
      totalSupply: null,
      maxSupply: null,
      fullyDilutedValuation: null,
      categories: [],
      recommendation: [],
    };

    return {
      data: detail,
      error: null,
      source: 'coingecko',
      lastUpdated: now,
      isDelayed: true,
      isConfigured: true,
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Failed to fetch crypto data',
      source: 'coingecko',
      lastUpdated: null,
      isDelayed: true,
      isConfigured: true,
    };
  }
}

export async function getAssetDetail(type: string, id: string): Promise<AssetDetailResponse> {
  if (type === 'stock' || type === 'etf') {
    return getStockDetail(id);
  } else if (type === 'crypto') {
    return getCryptoDetail(id);
  }
  
  return {
    data: null,
    error: 'Unsupported asset type',
    source: 'unknown',
    lastUpdated: null,
    isDelayed: true,
    isConfigured: false,
  };
}
