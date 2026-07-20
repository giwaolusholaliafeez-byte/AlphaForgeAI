import { NextResponse } from 'next/server';
import { IndicesClient, INDEX_PROXIES, IndexProxyAsset } from '@/lib/market-data/indices';
import { MarketDataError } from '@/lib/market-data/types';

export async function GET() {
  try {
    const apiKey = process.env.FINNHUB_API_KEY;
    
    if (!apiKey || apiKey.trim() === '') {
      return NextResponse.json(
        { 
          data: [],
          error: {
            code: 'FINNHUB_MISSING_KEY',
            message: 'Finnhub API key is not configured for ETF proxies'
          },
          source: 'finnhub',
          lastUpdated: null,
          isConfigured: false,
        },
        { status: 503 }
      );
    }

    const client = new IndicesClient(apiKey);
    
    try {
      const quotes = await client.getMultipleQuotes();
      
      const assets: IndexProxyAsset[] = Array.from(quotes.values());

      if (assets.length === 0) {
        return NextResponse.json(
          { 
            data: [],
            error: {
              code: 'FINNHUB_NO_PROXY_DATA',
              message: 'No ETF proxy data available. Finnhub may not support these symbols.'
            },
            source: 'finnhub',
            lastUpdated: null,
            isConfigured: true,
          },
          { status: 404 }
        );
      }

      return NextResponse.json({
        data: assets,
        error: null,
        source: 'finnhub',
        lastUpdated: new Date().toISOString(),
        isConfigured: true,
      });
      
    } catch (error) {
      const err = error as MarketDataError;
      
      let statusCode = 500;
      let errorCode = err.code || 'FINNHUB_ERROR';
      let errorMessage = err.message || 'Failed to fetch ETF proxy data';
      
      if (err.code === 'FINNHUB_401' || err.code === 'FINNHUB_403') {
        statusCode = 401;
        errorCode = 'FINNHUB_INVALID_KEY';
        errorMessage = 'Finnhub API key is invalid or rejected';
      } else if (err.code === 'FINNHUB_429') {
        statusCode = 429;
        errorCode = 'FINNHUB_RATE_LIMIT';
        errorMessage = 'Finnhub rate limit reached. Please try again later.';
      } else if (err.code === 'FINNHUB_TIMEOUT') {
        statusCode = 504;
        errorCode = 'FINNHUB_TIMEOUT';
        errorMessage = 'Finnhub request timed out';
      }

      return NextResponse.json(
        { 
          data: [],
          error: {
            code: errorCode,
            message: errorMessage
          },
          source: 'finnhub',
          lastUpdated: null,
          isConfigured: true,
        },
        { status: statusCode }
      );
    }
    
  } catch (error) {
    return NextResponse.json(
      { 
        data: [],
        error: {
          code: 'FINNHUB_ERROR',
          message: 'Failed to fetch ETF proxy data'
        },
        source: 'finnhub',
        lastUpdated: null,
        isConfigured: false,
      },
      { status: 500 }
    );
  }
}
