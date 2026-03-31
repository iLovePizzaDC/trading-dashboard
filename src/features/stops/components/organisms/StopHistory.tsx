import StopHistoryCard from '@/features/stops/components/molecules/StopHistoryCard';
import StopHistoryError from '@/features/stops/components/molecules/StopHistoryError';
import StopHistorySkeleton from '@/features/stops/components/molecules/StopHistorySkeleton';
import { fetchStopHistory } from '@/shared/api/data';
import { useFetch } from '@/shared/hooks/useFetch';

function StopHistory() {
	const { data, loading, error } = useFetch(fetchStopHistory);

	if (loading) return <StopHistorySkeleton />;
	if (error || !data) return <StopHistoryError />;

	return <StopHistoryCard data={data} />;
}

export default StopHistory;
