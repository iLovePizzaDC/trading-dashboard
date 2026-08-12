import SectorBreakdown from '@/features/sector/components/molecules/SectorBreakDown';
import SectorError from '@/features/sector/components/molecules/SectorError';
import SectorSkeleton from '@/features/sector/components/molecules/SectorSkeleton';
import { fetchDecisions, fetchTrades } from '@/shared/api/data';
import { useFetch } from '@/shared/hooks/useFetch';

function Sector() {
	const {
		data: decisions,
		loading: decisionsLoading,
		error: decisionsError,
	} = useFetch(fetchDecisions);
	const { data: trades, loading: tradesLoading, error: tradesError } = useFetch(fetchTrades);

	if (decisionsLoading || tradesLoading) return <SectorSkeleton />;
	if (decisionsError || tradesError || !decisions || !trades) return <SectorError />;

	return <SectorBreakdown decisions={decisions} trades={trades} />;
}

export default Sector;
