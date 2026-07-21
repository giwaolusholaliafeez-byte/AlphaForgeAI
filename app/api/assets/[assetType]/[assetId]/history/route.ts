import { NextResponse } from 'next/server';
import { 
  getStockHistory, 
  getCryptoHistory, getForexHistory,
  HISTORY_RANGES 
} from '@/lib/market-data/asset-history';
import { validateAssetType, validateStockSymbol, validateCryptoId, validateForexPair } from '@/lib/market-data/asset-validation';

type AssetRouteParams = {
  assetType: string;
  assetId: string;
};

export async function GET(
  request: Request,
  { params }: { params: Promise<AssetRouteParams> }
) {
  const { assetType, assetId } = await params;
  const { searchParams } = new URL(request.url);
  const range = searchParams.get('range') || '1D';
  const interval = searchParams.get('interval') || '1D';

  // Validate asset type
  if (!validateAssetType(assetType)) {
    return NextResponse.json(
      { error: 'Invalid asset type', code: 'INVALID_TYPE' },
      { status: 400 }
    );
  }

  // Validate asset ID based on type
  if (assetType === 'stock' || assetType === 'etf') {
    if (!validateStockSymbol(assetId)) {
      return NextResponse.json(
        { error: 'Invalid stock symbol', code: 'INVALID_SYMBOL' },
        { status: 400 }
      );
    }
  } else if (assetType === 'crypto') {
    if (!validateCryptoId(assetId)) {
      return NextResponse.json(
        { error: 'Invalid cryptocurrency ID', code: 'INVALID_ID' },
        { status: 400 }
      );
    }
  } else if (assetType === 'fx' && !validateForexPair(assetId)) {
    return NextResponse.json({ error: 'Invalid forex pair', code: 'INVALID_PAIR' }, { status: 400 });
  }

  // Validate range
  const validRange = HISTORY_RANGES.find(r => r.value === range);
  if (!validRange) {
    return NextResponse.json(
      { error: 'Invalid range', code: 'INVALID_RANGE' },
      { status: 400 }
    );
  }

  let history = null;

  if (assetType === 'stock' || assetType === 'etf') {
    history = await getStockHistory(assetId, range, interval);
  } else if (assetType === 'crypto') {
    history = await getCryptoHistory(assetId, range);
  } else if (assetType === 'fx') {
    history = await getForexHistory(assetId, range, interval);
  }

  if (!history) {
    return NextResponse.json(
      { error: 'Historical data not available', code: 'HISTORY_UNAVAILABLE' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    data: history,
    source: history.source,
    lastUpdated: history.lastUpdated,
    range: history.range,
    points: history.points.length,
  });
}
