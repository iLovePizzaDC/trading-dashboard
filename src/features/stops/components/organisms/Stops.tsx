import StopHistory from '@/features/stops/components/molecules/StopHistoryCard';
import StopsError from '@/features/stops/components/molecules/StopsError';
import StopsSkeleton from '@/features/stops/components/molecules/StopsSkeleton';
import { fetchStopHistory } from '@/shared/api/data';
import { useFetch } from '@/shared/hooks/useFetch';

function Stops() {
	const { data, loading, error } = useFetch(fetchStopHistory);

	if (loading) return <StopsSkeleton />;
	if (error || !data) return <StopsError />;

	return <StopHistory data={data} />;
}

export default Stops;
