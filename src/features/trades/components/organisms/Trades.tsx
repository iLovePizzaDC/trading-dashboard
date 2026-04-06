import TradesCard from '@/features/trades/components/molecules/TradesCard';
import TradeScatter from '@/features/trades/components/molecules/TradeScatter';
import TradesError from '@/features/trades/components/molecules/TradesError';
import TradesSkeleton from '@/features/trades/components/molecules/TradesSkeleton';
import TradeStatistics from '@/features/trades/components/molecules/TradeStatistics';
import { fetchTrades } from '@/shared/api/data';
import { useFetch } from '@/shared/hooks/useFetch';

function Trades() {
	const { data, loading, error } = useFetch(fetchTrades);

	if (loading) return <TradesSkeleton />;
	if (error || !data) return <TradesError />;

	return (
		<div className='space-y-4'>
			<div className='grid gap-4 lg:grid-cols-[4fr_3fr] items-start'>
				<TradeStatistics data={data} />
				<TradesCard data={data} />
			</div>
			<TradeScatter data={data} />
		</div>
	);
}

export default Trades;
