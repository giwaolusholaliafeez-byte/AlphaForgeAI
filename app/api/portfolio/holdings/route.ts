import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getPortfolioHoldings, portfolioBelongsToUser } from '@/lib/portfolio/queries';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const portfolioId = searchParams.get('portfolioId');

    if (!portfolioId) {
      return NextResponse.json(
        { error: 'Portfolio ID is required' },
        { status: 400 }
      );
    }

    // Verify ownership
    const ownsPortfolio = await portfolioBelongsToUser(portfolioId, user.id);
    if (!ownsPortfolio) {
      return NextResponse.json(
        { error: 'Portfolio not found' },
        { status: 404 }
      );
    }

    // Fetch holdings with both portfolio_id and user_id
    const holdings = await getPortfolioHoldings(portfolioId, user.id);

    return NextResponse.json({
      holdings,
      count: holdings.length,
    });
  } catch (error) {
    console.error('Error fetching holdings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch holdings' },
      { status: 500 }
    );
  }
}
