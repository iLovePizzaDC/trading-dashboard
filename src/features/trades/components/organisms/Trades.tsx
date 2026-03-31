import TradesCard from '@/features/trades/components/molecules/TradesCard';
import TradesError from '@/features/trades/components/molecules/TradesError';
import TradesSkeleton from '@/features/trades/components/molecules/TradesSkeleton';
import { fetchTrades } from '@/shared/api/data';
import { useFetch } from '@/shared/hooks/useFetch';

function Trades() {
	const { data, loading, error } = useFetch(fetchTrades);

	if (loading) return <TradesSkeleton />;
	if (error || !data) return <TradesError />;

	return <TradesCard data={data} />;
}

export default Trades;
