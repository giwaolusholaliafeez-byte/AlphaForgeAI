import { NextResponse } from 'next/server';
import { ForexClient, ForexAsset } from '@/lib/market-data/forex';
import { MarketDataError } from '@/lib/market-data/types';

export async function GET() {
  try {
    const client = new ForexClient();
    
    try {
      const quotes = await client.getRates();
      
      const assets: ForexAsset[] = Array.from(quotes.values());

      if (assets.length === 0) {
        return NextResponse.json(
          { 
            data: [],
            error: {
              code: 'FRANKFURTER_NO_DATA',
              message: 'No FX data available from Frankfurter API'
            },
            source: 'Frankfurter Daily Reference Rates',
            lastUpdated: null,
            isConfigured: true,
          },
          { status: 404 }
        );
      }

      return NextResponse.json({
        data: assets,
        error: null,
        source: 'Frankfurter Daily Reference Rates',
        lastUpdated: new Date().toISOString(),
        isConfigured: true,
      });
      
    } catch (error) {
      const err = error as MarketDataError;
      
      let statusCode = 500;
      let errorCode = err.code || 'FRANKFURTER_ERROR';
      let errorMessage = err.message || 'Failed to fetch FX data';
      
      if (err.code === 'FRANKFURTER_404') {
        statusCode = 404;
        errorCode = 'FRANKFURTER_NOT_FOUND';
        errorMessage = 'The configured Frankfurter endpoint was not found.';
      } else if (err.code === 'FRANKFURTER_429') {
        statusCode = 429;
        errorCode = 'FRANKFURTER_RATE_LIMIT';
        errorMessage = 'Frankfurter rate limit reached. Please try again later.';
      } else if (err.code === 'FRANKFURTER_TIMEOUT') {
        statusCode = 504;
        errorCode = 'FRANKFURTER_TIMEOUT';
        errorMessage = 'Frankfurter request timed out';
      } else if (err.code === 'FRANKFURTER_INVALID_RESPONSE') {
        statusCode = 500;
        errorCode = 'FRANKFURTER_INVALID_RESPONSE';
        errorMessage = 'Invalid response from Frankfurter API';
      } else if (err.code === 'FRANKFURTER_NO_RATES') {
        statusCode = 404;
        errorCode = 'FRANKFURTER_NO_RATES';
        errorMessage = 'No rate data available from Frankfurter';
      } else if (err.code === 'FRANKFURTER_INSUFFICIENT_DATA') {
        statusCode = 404;
        errorCode = 'FRANKFURTER_INSUFFICIENT_DATA';
        errorMessage = 'Insufficient historical data from Frankfurter';
      }

      return NextResponse.json(
        { 
          data: [],
          error: {
            code: errorCode,
            message: errorMessage
          },
          source: 'Frankfurter Daily Reference Rates',
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
          code: 'FRANKFURTER_ERROR',
          message: 'Failed to fetch FX data'
        },
        source: 'Frankfurter Daily Reference Rates',
        lastUpdated: null,
        isConfigured: false,
      },
      { status: 500 }
    );
  }
}
