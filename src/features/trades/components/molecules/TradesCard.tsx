import TradeGroupRow from '@/features/trades/components/atoms/TradeGroupRow';
import { groupTrades } from '@/features/trades/utils/trades-card';
import type { Trade } from '@/shared/types/trades';
import { usd } from '@/shared/utils/currency';
import { useMemo } from 'react';

interface ITradesCard {
	data: Trade[];
}

function TradesCard({ data }: ITradesCard) {
	const groups = useMemo(() => groupTrades(data), [data]);

	const totalPnl = data
		.filter((t) => t.pnl !== undefined)
		.reduce((sum, t) => sum + (t.pnl ?? 0), 0);

	const isPos = totalPnl >= 0;

	const totalPnlFormatted = usd(totalPnl);

	return (
		<div className='rounded-xl border border-white/10 bg-linear-to-br from-white/5 to-white/0 p-4 transition-colors duration-300 hover:border-white/20'>
			<div className='mb-3 flex items-baseline justify-between'>
				<div className='flex items-center gap-2'>
					<span className='w-1 h-4 bg-purple-500 rounded-full' />
					<p className='text-xs uppercase tracking-wider text-white/40'>
						trade history ({data.length})
					</p>
				</div>
				<p className={`text-sm font-medium ${isPos ? 'text-green-400' : 'text-red-400'}`}>
					{totalPnlFormatted}
				</p>
			</div>

			<div
				className='max-h-64 overflow-y-auto pr-3 -mr-3 [scrollbar-width:thin] space-y-3
					mask-[linear-gradient(to_bottom,black_calc(100%-40px),transparent_100%)]
					[-webkit-mask-image:linear-gradient(to_bottom,black_calc(100%-40px),transparent_100%)]'
			>
				{groups.map((group) => (
					<TradeGroupRow key={group.symbol} group={group} />
				))}
			</div>
		</div>
	);
}

export default TradesCard;
