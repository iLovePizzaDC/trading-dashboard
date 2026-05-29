import TradesCard from '@/features/trades/components/molecules/TradesCard';
import TradeScatter from '@/features/trades/components/molecules/TradeScatter';
import TradesError from '@/features/trades/components/molecules/TradesError';
import TradesSkeleton from '@/features/trades/components/molecules/TradesSkeleton';
import TradeStatistics from '@/features/trades/components/molecules/TradeStatistics';
import { fetchStopHistory, fetchTrades } from '@/shared/api/data';
import { useFetch } from '@/shared/hooks/useFetch';

function Trades() {
	const { data: tradesData, loading: tradesLoading, error: tradesError } = useFetch(fetchTrades);
	const {
		data: stopHistoryData,
		loading: stopHistoryLoading,
		error: stopHistoryError,
	} = useFetch(fetchStopHistory);

	if (tradesLoading || stopHistoryLoading) return <TradesSkeleton />;
	if (tradesError || !tradesData || stopHistoryError || !stopHistoryData) return <TradesError />;

	return (
		<div className='space-y-6'>
			<div className='grid gap-6 lg:grid-cols-[4fr_3fr] items-start'>
				<TradeStatistics data={tradesData} />
				<TradesCard data={tradesData} stopHistory={stopHistoryData} />
			</div>
			<TradeScatter data={tradesData} />
		</div>
	);
}

export default Trades;
