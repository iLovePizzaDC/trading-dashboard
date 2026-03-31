import { fetchOpenStops, fetchTrades } from '@/shared/api/data';
import { useFetch } from '@/shared/hooks/useFetch';
import type { OpenStops } from '@/shared/types/stops';
import type { Trade } from '@/shared/types/trades';
import PositionRow from '../molecules/PositionRow';
import PositionsEmpty from '../molecules/PositionsEmpty';
import PositionsError from '../molecules/PositionsError';
import PositionsSkeleton from '../molecules/PositionsSkeleton';

function OpenPositions() {
	const { data: stops, loading: stopsLoading, error: stopsError } = useFetch(fetchOpenStops);
	const { data: trades, loading: tradesLoading, error: tradesError } = useFetch(fetchTrades);

	if (stopsLoading || tradesLoading) return <PositionsSkeleton />;
	if (stopsError || tradesError || !stops || !trades) return <PositionsError />;

	const symbols = Object.keys(stops as OpenStops);
	if (symbols.length === 0) return <PositionsEmpty />;

	const lastBuy = (trades as Trade[]).reduce<Record<string, Trade>>((acc, t) => {
		if (t.action === 'buy') acc[t.symbol] = t;
		return acc;
	}, {});

	return (
		<div className='rounded-xl border border-white/10 bg-white/5 p-4'>
			<p className='mb-2 text-xs uppercase tracking-wider text-white/40'>
				open positions ({symbols.length})
			</p>
			{symbols.map((symbol) => (
				<PositionRow
					key={symbol}
					symbol={symbol}
					stop={(stops as OpenStops)[symbol]}
					trade={lastBuy[symbol]}
				/>
			))}
		</div>
	);
}

export default OpenPositions;
