import SummaryCard from '@/features/summary/components/molecules/SummaryCard';
import SummaryCardError from '@/features/summary/components/molecules/SummaryCardError';
import SummaryCardSkeleton from '@/features/summary/components/molecules/SummaryCardSkeleton';
import { fetchLastRebalanceDate, fetchLastWeeklyReportDate, fetchSummary } from '@/shared/api/data';
import { useFetch } from '@/shared/hooks/useFetch';

function Summary() {
	const {
		data: lastRebalanceData,
		loading: lastRebalanceLoading,
		error: lastRebalanceError,
	} = useFetch(fetchLastRebalanceDate);
	const {
		data: lastWeeklyReportData,
		loading: lastWeeklyReportLoading,
		error: lastWeeklyReportError,
	} = useFetch(fetchLastWeeklyReportDate);
	const {
		data: summaryData,
		loading: summaryLoading,
		error: summaryError,
	} = useFetch(fetchSummary);

	if (lastRebalanceLoading || lastWeeklyReportLoading || summaryLoading)
		return <SummaryCardSkeleton />;

	if (
		lastRebalanceError ||
		!lastRebalanceData ||
		lastWeeklyReportError ||
		!lastWeeklyReportData ||
		summaryError ||
		!summaryData
	)
		return <SummaryCardError />;

	return (
		<SummaryCard
			lastRebalance={lastRebalanceData}
			lastWeeklyReport={lastWeeklyReportData}
			summary={summaryData}
		/>
	);
}

export default Summary;
