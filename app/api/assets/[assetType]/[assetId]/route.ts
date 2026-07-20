import { NextResponse } from 'next/server';
import { getAssetDetail } from '@/lib/market-data/asset-details';
import { validateAssetType, validateStockSymbol, validateCryptoId } from '@/lib/market-data/asset-validation';

type AssetRouteParams = {
  assetType: string;
  assetId: string;
};

export async function GET(
  request: Request,
  { params }: { params: Promise<AssetRouteParams> }
) {
  const { assetType, assetId } = await params;

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
  }

  const result = await getAssetDetail(assetType, assetId);

  if (result.error) {
    const status = result.isConfigured ? 404 : 503;
    return NextResponse.json(
      { error: result.error, code: 'ASSET_NOT_FOUND' },
      { status }
    );
  }

  return NextResponse.json({
    data: result.data,
    source: result.source,
    lastUpdated: result.lastUpdated,
    isDelayed: result.isDelayed,
    isConfigured: result.isConfigured,
  });
}
