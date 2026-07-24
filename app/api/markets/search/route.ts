import { NextResponse } from 'next/server';
import { FinnhubClient } from '@/lib/market-data/finnhub';
import { CoinGeckoClient } from '@/lib/market-data/coingecko';
import { MarketSearchResult, MarketDataError } from '@/lib/market-data/types';
import { TwelveDataClient } from '@/lib/market-data/twelve-data';
import { CURRENCY_PAIRS } from '@/lib/market-data/forex';
import { classifyTwelveDataInstrument } from '@/lib/market-data/search-classify';

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

  if (type === 'all' || type === 'fx') {
    const normalized = query.replace(/[^A-Za-z]/g, '').toLowerCase();
    CURRENCY_PAIRS.filter((pair) => pair.id.replace('_', '').includes(normalized) || pair.display.toLowerCase().includes(query.toLowerCase())).slice(0, 10).forEach((pair) => results.push({ id: pair.id.replace('_', ''), symbol: pair.display, name: `${pair.base}/${pair.quote} foreign exchange`, type: 'fx', source: 'frankfurter' }));
  }

  // Twelve Data's symbol search also returns instrument types we don't
  // support trading/tracking (warrants, physical-currency duplicates of the
  // FX pairs already sourced from CURRENCY_PAIRS above, trusts, etc). Only
  // surface types we can actually resolve to a supported asset class.
  const twelveKey = process.env.TWELVE_DATA_API_KEY;
  if ((type === 'all' || type === 'stock' || type === 'etf') && twelveKey) {
    try {
      const response = await new TwelveDataClient(twelveKey).search(query);
      response.data.slice(0, 10).forEach((item) => {
        const assetType = classifyTwelveDataInstrument(item.instrument_type);
        if (!assetType) return;
        if (type === 'all' || type === assetType) results.push({ id: item.symbol, symbol: item.symbol, name: item.name, type: assetType, exchange: item.exchange, source: 'twelvedata' });
      });
    } catch (error) { console.warn('Twelve Data search failed:', error); }
  }

  return NextResponse.json({ results });
}
