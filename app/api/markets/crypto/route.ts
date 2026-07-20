import { NextResponse } from 'next/server';
import { CoinGeckoClient } from '@/lib/market-data/coingecko';
import { CryptoAsset, MarketDataError } from '@/lib/market-data/types';

const CRYPTO_UNIVERSE = [
  'bitcoin', 
  'ethereum', 
  'solana', 
  'binancecoin', 
  'ripple',
  'cardano', 
  'dogecoin', 
  'avalanche-2', 
  'chainlink', 
  'polkadot'
];

export async function GET() {
  try {
    const client = new CoinGeckoClient();
    
    try {
      const marketData = await client.getMarketData(CRYPTO_UNIVERSE);
      
      if (!Array.isArray(marketData)) {
        return NextResponse.json(
          { 
            data: [],
            error: {
              code: 'COINGECKO_INVALID_RESPONSE',
              message: 'Invalid response format from CoinGecko'
            },
            source: 'CoinGecko Keyless API',
            lastUpdated: null,
            isConfigured: true,
          },
          { status: 500 }
        );
      }

      const assets: CryptoAsset[] = marketData
        .filter(item => item && typeof item === 'object' && item.id)
        .map(item => client.normalizeAsset(item));

      return NextResponse.json({
        data: assets,
        error: null,
        source: 'CoinGecko Keyless API',
        lastUpdated: new Date().toISOString(),
        isConfigured: true,
      });
      
    } catch (error) {
      const err = error as MarketDataError;
      
      let statusCode = 500;
      let errorCode = err.code || 'COINGECKO_ERROR';
      let errorMessage = err.message || 'Failed to fetch crypto data';
      
      if (err.code === 'COINGECKO_429') {
        statusCode = 429;
        errorCode = 'COINGECKO_RATE_LIMIT';
        errorMessage = 'CoinGecko rate limit reached. Please try again later.';
      } else if (err.code === 'COINGECKO_TIMEOUT') {
        statusCode = 504;
        errorCode = 'COINGECKO_TIMEOUT';
        errorMessage = 'CoinGecko request timed out. Please try again.';
      } else if (err.code === 'COINGECKO_INVALID_RESPONSE') {
        statusCode = 500;
        errorCode = 'COINGECKO_INVALID_RESPONSE';
        errorMessage = 'Invalid response from CoinGecko. Please try again.';
      } else if (err.code?.startsWith('COINGECKO_5')) {
        statusCode = 503;
        errorCode = 'COINGECKO_UNAVAILABLE';
        errorMessage = 'CoinGecko service is currently unavailable. Please try again later.';
      }

      return NextResponse.json(
        { 
          data: [],
          error: {
            code: errorCode,
            message: errorMessage
          },
          source: 'CoinGecko Keyless API',
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
          code: 'COINGECKO_ERROR',
          message: 'Failed to fetch cryptocurrency data'
        },
        source: 'CoinGecko Keyless API',
        lastUpdated: null,
        isConfigured: false,
      },
      { status: 500 }
    );
  }
}
