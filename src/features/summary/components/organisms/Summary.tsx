import HeroCards from '@/features/summary/components/molecules/HeroCards';
import SummaryCards from '@/features/summary/components/molecules/SummaryCards';
import SummaryError from '@/features/summary/components/molecules/SummaryError';
import SummarySkeleton from '@/features/summary/components/molecules/SummarySkeleton';
import { fetchSummary } from '@/shared/api/data';
import { useFetch } from '@/shared/hooks/useFetch';

function Summary() {
  const { data, loading, error } = useFetch(fetchSummary);

  if (loading) return <SummarySkeleton />;

  if (error || !data) return <SummaryError />;

  return (
    <div className='space-y-4'>
      <HeroCards portfolioValue={data.portfolio_value} profit={data.profit} regime={data.regime} />
      <SummaryCards summary={data} />
    </div>
  );
}

export default Summary;
