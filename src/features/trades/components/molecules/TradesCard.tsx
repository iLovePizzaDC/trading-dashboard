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

	const totalPnlFormatted = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
	}).format(totalPnl);

	return (
		<div className='rounded-xl border border-white/10 bg-white/5 p-4'>
			<div className='mb-3 flex items-baseline justify-between'>
				<p className='text-xs uppercase tracking-wider text-white/40'>
					trade history ({data.length})
				</p>
				<p className={`text-sm font-medium ${isPos ? 'text-green-400' : 'text-red-400'}`}>
					{totalPnlFormatted}
				</p>
			</div>

			<div className='overflow-y-auto max-h-52 pb-3 pr-1.5 -mr-1.5 [scrollbar-width:thin] mask-[linear-gradient(to_bottom,black_calc(100%-40px),transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_calc(100%-40px),transparent_100%)]'>
				{sorted.map((trade, index) => (
					<TradeRow
						key={`${trade.date}-${trade.symbol}-${trade.action}-${index}`}
						trade={trade}
						isLast={index === sorted.length - 1}
					/>
				))}
			</div>
		</div>
	);
}

export default TradesCard;
