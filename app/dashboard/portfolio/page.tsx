import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { isDemoAccount } from '@/lib/demo-account';
import { getPortfolios, getPortfolioWithHoldings, getTableExists } from '@/lib/portfolio/queries';
import { PortfolioHolding } from '@/types/portfolio';
import { Suspense } from 'react';
import PortfolioContent from './PortfolioContent';
import PortfolioLoadingState from '@/components/portfolio/PortfolioLoadingState';
import { calculatePortfolioValuation } from '@/lib/portfolio/valuation';

export default async function PortfolioPage({
  searchParams,
}: {
  searchParams: Promise<{ portfolio?: string }>
}) {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/sign-in');
  }

  const isDemo = isDemoAccount(user.email);
  const params = await searchParams;
  const requestedPortfolioId = params?.portfolio || null;

  const tablesExist = await getTableExists('portfolios');

  // Get all portfolios for the user
  const portfolios = await getPortfolios(user.id);

  // Determine which portfolio to display
  let selectedPortfolio = null;
  
  if (portfolios.length > 0) {
    if (requestedPortfolioId) {
      const found = portfolios.find(p => p.id === requestedPortfolioId);
      if (found) {
        selectedPortfolio = found;
      }
    }
    
    if (!selectedPortfolio) {
      const defaultPortfolio = portfolios.find(p => p.isDefault);
      selectedPortfolio = defaultPortfolio || portfolios[0];
    }
  }

  // Get holdings for the selected portfolio
  let holdings: PortfolioHolding[] = [];
  if (selectedPortfolio) {
    const result = await getPortfolioWithHoldings(selectedPortfolio.id, user.id);
    holdings = Array.isArray(result.holdings) ? result.holdings : [];
  }

  const valuation = selectedPortfolio
    ? await calculatePortfolioValuation(
        holdings,
        selectedPortfolio.cashBalance
      )
    : null;

  const generatedAt = new Date().toISOString();

  return (
    <Suspense fallback={<PortfolioLoadingState />}>
      <PortfolioContent
        portfolio={selectedPortfolio}
        holdings={holdings}
        valuation={valuation}
        portfolios={portfolios}
        isDemo={isDemo}
        tablesExist={tablesExist}
        generatedAt={generatedAt}
        requestedPortfolioId={requestedPortfolioId}
      />
    </Suspense>
  );
}
