import SummaryCard from '@/features/summary/components/molecules/SummaryCard';
import SummaryCardError from '@/features/summary/components/molecules/SummaryCardError';
import SummaryCardSkeleton from '@/features/summary/components/molecules/SummaryCardSkeleton';
import { fetchSummary } from '@/shared/api/data';
import { useFetch } from '@/shared/hooks/useFetch';

function Summary() {
	const {
		data: summaryData,
		loading: summaryLoading,
		error: summaryError,
	} = useFetch(fetchSummary);

	if (summaryLoading) return <SummaryCardSkeleton />;

	if (summaryError || !summaryData) return <SummaryCardError />;

	return <SummaryCard summary={summaryData} />;
}

export default Summary;
