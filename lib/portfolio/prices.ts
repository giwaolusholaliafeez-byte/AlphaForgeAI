import { PortfolioHolding } from '@/types/portfolio';
import { toFiniteNumber } from './normalizers';
import { FinnhubClient } from '@/lib/market-data/finnhub';
import { CoinGeckoClient } from '@/lib/market-data/coingecko';
import { TwelveDataClient } from '@/lib/market-data/twelve-data';
import { ForexClient } from '@/lib/market-data/forex';
import { normalizeAssetIdentity } from '@/lib/market-data/identity';

// Cache for prices to avoid repeated API calls
const priceCache = new Map<string, { price: number; timestamp: number }>();
const CACHE_DURATION = 60000; // 1 minute

export async function getCurrentPrices(holdings: PortfolioHolding[]): Promise<Map<string, number>> {
  const priceMap = new Map<string, number>();
  const now = Date.now();

  // Separate holdings by asset type for batch fetching
  const holdingsByType: Record<string, PortfolioHolding[]> = {};

  holdings.forEach(h => {
    if (!holdingsByType[h.assetType]) {
      holdingsByType[h.assetType] = [];
    }
    holdingsByType[h.assetType].push(h);
  });

  // Fetch prices for each holding
  await Promise.all(
    Object.entries(holdingsByType).map(async ([assetType, items]) => {
      // Check cache first
      const uncachedItems = items.filter(item => {
        const cacheKey = `${assetType}:${item.assetType === 'crypto' ? item.assetId : item.symbol}`;
        const cached = priceCache.get(cacheKey);
        if (cached && (now - cached.timestamp) < CACHE_DURATION) {
          priceMap.set(item.id, cached.price);
          return false;
        }
        return true;
      });

      if (uncachedItems.length === 0) return;

      try {
        const prices = await fetchPrices(assetType, uncachedItems);
        
        prices.forEach((price, index) => {
          if (price !== null && price > 0) {
            const item = uncachedItems[index];
            priceMap.set(item.id, price);
            const cacheKey = `${assetType}:${item.assetType === 'crypto' ? item.assetId : item.symbol}`;
            priceCache.set(cacheKey, { price, timestamp: now });
          }
        });
      } catch (error) {
        console.error(`Error fetching prices for ${assetType}:`, error);
      }
    })
  );

  return priceMap;
}

async function fetchPrices(
  assetType: string,
  items: PortfolioHolding[]
): Promise<(number | null)[]> {
  const prices = await Promise.all(
    items.map(async (item) => {
      try {
        const price = await fetchSinglePrice(item);
        return price;
      } catch (error) {
        console.error(`Error fetching price for ${item.symbol}:`, error);
        return null;
      }
    })
  );

  return prices;
}

async function fetchSinglePrice(holding: PortfolioHolding): Promise<number | null> {
  try {
    switch (holding.assetType) {
      case 'stock':
      case 'etf':
      case 'index_proxy':
        return await fetchStockPrice(holding.symbol);
      case 'crypto':
        return await fetchCryptoPrice(holding.assetId);
      case 'fx':
        return await fetchForexPrice(holding.assetId, holding.symbol);
      default:
        return null;
    }
  } catch (error) {
    console.error(`Error fetching price for ${holding.symbol}:`, error);
    return null;
  }
}

async function fetchForexPrice(assetId: string, symbol: string): Promise<number | null> {
  const identity = normalizeAssetIdentity({ assetType: 'fx', assetId, symbol }); const key = process.env.TWELVE_DATA_API_KEY;
  if (key) { const quote = await withTimeout(new TwelveDataClient(key).getQuote(identity.displaySymbol), 12_000).catch(() => null); const price = toFiniteNumber(quote?.price, 0); if (price > 0) return price; }
  const fallback = await withTimeout(new ForexClient().getRates(), 12_000).catch(() => new Map()); return toFiniteNumber(fallback.get(identity.assetId)?.price, 0) || null;
}

async function fetchStockPrice(symbol: string): Promise<number | null> {
  const apiKey = process.env.FINNHUB_API_KEY;
  if (!apiKey || !symbol.trim()) return null;

  const quote = await withTimeout(
    new FinnhubClient(apiKey).getQuote(symbol.trim().toUpperCase()),
    12_000
  );
  const price = toFiniteNumber(quote.c, 0);
  return price > 0 ? price : null;
}

async function fetchCryptoPrice(assetId: string): Promise<number | null> {
  if (!assetId.trim()) return null;

  const marketData = await withTimeout(
    new CoinGeckoClient().getMarketData([assetId.trim()]),
    12_000
  );
  const price = toFiniteNumber(marketData[0]?.current_price, 0);
  return price > 0 ? price : null;
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error('Market price request timed out')), timeoutMs);
  });

  try {
    return await Promise.race([promise, timeout]);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}
