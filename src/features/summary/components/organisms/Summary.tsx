import HeroCards from '@/features/summary/components/molecules/HeroCards';
import SummaryCards from '@/features/summary/components/molecules/SummaryCards';
import SummaryError from '@/features/summary/components/molecules/SummaryError';
import SummarySkeleton from '@/features/summary/components/molecules/SummarySkeleton';
import { fetchSummary } from '@/shared/api/data';
import { useFetch } from '@/shared/hooks/useFetch';

function Summary() {
	const {
		data: summaryData,
		loading: summaryLoading,
		error: summaryError,
	} = useFetch(fetchSummary);

	if (summaryLoading) return <SummarySkeleton />;

	if (summaryError || !summaryData) return <SummaryError />;

	return (
		<div className='space-y-4'>
			<HeroCards
				portfolioValue={summaryData.portfolio_value}
				profit={summaryData.profit}
				regime={summaryData.regime}
			/>
			<SummaryCards summary={summaryData} />
		</div>
	);
}

export default Summary;
