import { NextResponse } from 'next/server';
import { FinnhubClient } from '@/lib/market-data/finnhub';
import { StockAsset, MarketDataError } from '@/lib/market-data/types';
import { createMarketDataError } from '@/lib/market-data/errors';

const STOCK_UNIVERSE = [
  'AAPL', 'MSFT', 'NVDA', 'AMZN', 'META', 'GOOGL', 'TSLA', 'AMD',
  'JPM', 'V', 'NFLX', 'INTC', 'SPY', 'QQQ', 'DIA', 'VOO'
];

export async function GET(request: Request) {
  try {
    const apiKey = process.env.FINNHUB_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'FINNHUB_API_KEY is not configured', code: 'FINNHUB_MISSING_KEY' },
        { status: 500 }
      );
    }

    const client = new FinnhubClient(apiKey);
    
    // Get quotes for all stocks
    const quotes = await client.getMultipleQuotes(STOCK_UNIVERSE);
    
    // Fetch profiles for available stocks
    const assets: StockAsset[] = [];
    
    for (const symbol of STOCK_UNIVERSE) {
      const quote = quotes.get(symbol);
      if (quote) {
        try {
          // Try to get profile for additional info
          const profile = await client.getProfile(symbol).catch(() => undefined);
          const asset = client.normalizeQuote(symbol, quote, profile);
          assets.push(asset);
        } catch {
          // Fallback without profile
          const asset = client.normalizeQuote(symbol, quote);
          assets.push(asset);
        }
      }
    }

    return NextResponse.json({
      assets,
      timestamp: new Date().toISOString(),
      source: 'finnhub',
      total: assets.length,
    });
    
  } catch (error) {
    const err = error as MarketDataError;
    return NextResponse.json(
      { error: err.message || 'Failed to fetch stock data', code: err.code || 'UNKNOWN' },
      { status: 500 }
    );
  }
}
