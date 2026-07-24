import { NextResponse } from 'next/server';
import { FinnhubClient } from '@/lib/market-data/finnhub';
import { StockAsset, MarketDataError } from '@/lib/market-data/types';
import { getStockUniversePage } from '@/lib/market-data/stock-universe';

const DEFAULT_PAGE_SIZE = 25;
const MAX_PAGE_SIZE = 50;

export async function GET(request: Request) {
  try {
    const apiKey = process.env.FINNHUB_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'FINNHUB_API_KEY is not configured', code: 'FINNHUB_MISSING_KEY' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const assetClass = searchParams.get('assetClass') === 'etf' ? 'etf' : 'stock';
    const page = Math.max(1, Number(searchParams.get('page')) || 1);
    const pageSize = Math.min(MAX_PAGE_SIZE, Math.max(1, Number(searchParams.get('pageSize')) || DEFAULT_PAGE_SIZE));

    const { symbols, total } = await getStockUniversePage(assetClass, page, pageSize, apiKey);

    const client = new FinnhubClient(apiKey);
    const quotes = await client.getMultipleQuotes(symbols.map((item) => item.symbol));

    const assets: StockAsset[] = symbols
      .map((item) => {
        const quote = quotes.get(item.symbol);
        if (!quote) return null;
        return client.normalizeQuote(item.symbol, quote, undefined, assetClass, item.name);
      })
      .filter((item): item is StockAsset => item !== null);

    return NextResponse.json({
      assets,
      timestamp: new Date().toISOString(),
      source: 'finnhub',
      total,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    });

  } catch (error) {
    const err = error as MarketDataError;
    return NextResponse.json(
      { error: err.message || 'Failed to fetch stock data', code: err.code || 'UNKNOWN' },
      { status: 500 }
    );
  }
}
