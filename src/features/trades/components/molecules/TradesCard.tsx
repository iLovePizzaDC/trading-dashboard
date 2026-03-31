import TradeRow from '@/features/trades/components/atoms/TradeRow';
import type { Trade } from '@/shared/types/trades';

interface ITradesCard {
	data: Trade[];
}

function TradesCard({ data }: ITradesCard) {
	const sorted = [...data].sort((a, b) => b.date.localeCompare(a.date));

	const totalPnl = data
		.filter((t) => t.pnl !== undefined)
		.reduce((sum, t) => sum + (t.pnl ?? 0), 0);

	const isPos = totalPnl >= 0;

	return (
		<div className='rounded-xl border border-white/10 bg-white/5 p-4'>
			<div className='mb-3 flex items-baseline justify-between'>
				<p className='text-xs uppercase tracking-wider text-white/40'>
					trade history ({data.length})
				</p>
				<p className={`text-sm font-medium ${isPos ? 'text-green-400' : 'text-red-400'}`}>
					{totalPnl >= 0 ? '+' : ''}
					{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalPnl)}
				</p>
			</div>
			{sorted.map((trade, i) => (
				<TradeRow key={`${trade.date}-${trade.symbol}-${trade.action}-${i}`} trade={trade} />
			))}
		</div>
	);
}

export default TradesCard;
