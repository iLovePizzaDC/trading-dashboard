import EquityCurve from '@/features/equity/components/molecules/EquityCurve';
import EquityError from '@/features/equity/components/molecules/EquityError';
import EquitySkeleton from '@/features/equity/components/molecules/EquitySkeleton';
import MonthlyHeatmap from '@/features/equity/components/molecules/MonthlyHeatmap';
import { fetchBotEquity, fetchDecisions, fetchDeposits, fetchSpyEquity } from '@/shared/api/data';
import { useFetch } from '@/shared/hooks/useFetch';

function Equity() {
  const {
    data: botEquity,
    loading: botEquityLoading,
    error: botEquityError,
  } = useFetch(fetchBotEquity);
  const {
    data: spyEquity,
    loading: spyEquityLoading,
    error: spyEquityError,
  } = useFetch(fetchSpyEquity);
  const { data: deposits, loading: depositsLoading } = useFetch(fetchDeposits);
  const {
    data: decisions,
    loading: decisionsLoading,
    error: decisionsError,
  } = useFetch(fetchDecisions);

  if (botEquityLoading || spyEquityLoading || depositsLoading || decisionsLoading)
    return <EquitySkeleton />;
  if (
    botEquityError ||
    !botEquity ||
    spyEquityError ||
    !spyEquity ||
    !deposits ||
    decisionsError ||
    !decisions
  )
    return <EquityError />;

  const spyMap = new Map(spyEquity.map((s) => [s.date, s]));

  const mergedData = botEquity.map((point) => ({
    ...point,
    spy: spyMap.get(point.date)?.equity ?? null,
  }));

  return (
    <div className='grid grid-cols-1 gap-6 lg:grid-cols-[3fr_2fr] items-start'>
      <EquityCurve data={mergedData} deposits={deposits} decisions={decisions} />
      <MonthlyHeatmap data={botEquity} deposits={deposits} />
    </div>
  );
}

export default Equity;
