import { NextResponse } from 'next/server';
import { getAssetDetail } from '@/lib/market-data/asset-details';
import { isValidAssetRoute } from '@/lib/market-data/asset-validation';

type AssetRouteParams = {
  assetType: string;
  assetId: string;
};

export async function GET(
  request: Request,
  { params }: { params: Promise<AssetRouteParams> }
) {
  const { assetType, assetId } = await params;

  if (!isValidAssetRoute(assetType, assetId)) {
    return NextResponse.json(
      { error: 'Invalid asset type or identifier', code: 'INVALID_ASSET' },
      { status: 400 }
    );
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
