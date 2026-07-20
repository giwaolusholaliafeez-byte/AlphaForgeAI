import { NextResponse } from 'next/server';
import { FinnhubClient } from '@/lib/market-data/finnhub';
import { CoinGeckoClient } from '@/lib/market-data/coingecko';
import { MarketSearchResult, MarketDataError } from '@/lib/market-data/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.trim();
  const type = searchParams.get('type') || 'all';

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const results: MarketSearchResult[] = [];
  const finnhubKey = process.env.FINNHUB_API_KEY;

  // Search stocks via Finnhub
  if ((type === 'all' || type === 'stock' || type === 'etf') && finnhubKey) {
    try {
      const finnhub = new FinnhubClient(finnhubKey);
      const searchResult = await finnhub.search(query);
      
      searchResult.result.slice(0, 5).forEach(item => {
        const isETF = item.type?.toLowerCase().includes('etf') || 
                      item.description?.toLowerCase().includes('etf') ||
                      ['SPY', 'QQQ', 'DIA', 'VOO', 'IWM'].includes(item.symbol);
        
        const assetType = isETF ? 'etf' : 'stock';
        
        if (type === 'all' || type === assetType) {
          results.push({
            id: item.symbol,
            symbol: item.symbol,
            name: item.description || item.symbol,
            type: assetType,
            exchange: item.primaryExchange,
            source: 'finnhub',
          });
        }
      });
    } catch (error) {
      console.warn('Finnhub search failed:', error);
    }
  }

  // Search crypto via CoinGecko (keyless public API)
  if (type === 'all' || type === 'crypto') {
    try {
      const coingecko = new CoinGeckoClient();
      const cryptoResults = await coingecko.search(query);
      
      cryptoResults.slice(0, 5).forEach(item => {
        results.push({
          id: item.id,
          symbol: item.symbol,
          name: item.name,
          type: 'crypto',
          source: 'coingecko',
        });
      });
    } catch (error) {
      console.warn('CoinGecko search failed:', error);
    }
  }

  return NextResponse.json({ results });
}
