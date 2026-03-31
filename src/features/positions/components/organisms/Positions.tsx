import PositionsCard from '@/features/positions/components/molecules/PositionsCard';
import PositionsError from '@/features/positions/components/molecules/PositionsError';
import PositionsSkeleton from '@/features/positions/components/molecules/PositionsSkeleton';
import { fetchOpenStops, fetchTrades } from '@/shared/api/data';
import { useFetch } from '@/shared/hooks/useFetch';

function Positions() {
	const { data: stops, loading: stopsLoading, error: stopsError } = useFetch(fetchOpenStops);
	const { data: trades, loading: tradesLoading, error: tradesError } = useFetch(fetchTrades);

	if (stopsLoading || tradesLoading) return <PositionsSkeleton />;
	if (stopsError || tradesError || !stops || !trades) return <PositionsError />;

	return <PositionsCard stops={stops} trades={trades} />;
}

export default Positions;
