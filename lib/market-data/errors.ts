import { MarketDataError } from './types';

export function createMarketDataError(
  code: string,
  message: string,
  source?: string,
  details?: any
): MarketDataError {
  return {
    code,
    message,
    source,
    details,
  };
}

export function getUserFriendlyErrorMessage(error: MarketDataError): string {
  switch (error.code) {
    case 'FINNHUB_MISSING_KEY':
      return 'Finnhub API key is not configured. Please add FINNHUB_API_KEY to your environment variables.';
    case 'COINGECKO_MISSING_KEY':
      return 'CoinGecko API key is not configured. Please add COINGECKO_DEMO_API_KEY to your environment variables.';
    case 'FINNHUB_401':
      return 'Invalid Finnhub API key. Please check your configuration.';
    case 'COINGECKO_401':
      return 'Invalid CoinGecko API key. Please check your configuration.';
    case 'FINNHUB_429':
      return 'Finnhub rate limit exceeded. Please try again later.';
    case 'COINGECKO_429':
      return 'CoinGecko rate limit exceeded. Please try again later.';
    case 'FINNHUB_403':
      return 'Finnhub access forbidden. Please check your API key permissions.';
    case 'COINGECKO_403':
      return 'CoinGecko access forbidden. Please check your API key permissions.';
    case 'FINNHUB_NETWORK_ERROR':
      return 'Failed to connect to Finnhub. Please check your network connection.';
    case 'COINGECKO_NETWORK_ERROR':
      return 'Failed to connect to CoinGecko. Please check your network connection.';
    default:
      return error.message || 'An unexpected error occurred while fetching market data.';
  }
}

export function isConfigError(error: MarketDataError): boolean {
  return error.code === 'FINNHUB_MISSING_KEY' || error.code === 'COINGECKO_MISSING_KEY';
}

export function isRateLimitError(error: MarketDataError): boolean {
  return error.code === 'FINNHUB_429' || error.code === 'COINGECKO_429';
}
