import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

import TradeRow from '@/features/trades/components/atoms/TradeRow';
import type { Trade } from '@/shared/types/trades';

const PREVIEW_COUNT = 5;
const ROW_HEIGHT = 44;

interface ITradesCard {
	data: Trade[];
}

function TradesCard({ data }: ITradesCard) {
	const [expanded, setExpanded] = useState(false);

	const sorted = [...data].sort((a, b) => b.date.localeCompare(a.date));

	const totalPnl = data
		.filter((t) => t.pnl !== undefined)
		.reduce((sum, t) => sum + (t.pnl ?? 0), 0);

	const isPos = totalPnl >= 0;
	const hasMore = sorted.length > PREVIEW_COUNT;

	const collapsedHeight = PREVIEW_COUNT * ROW_HEIGHT;
	const fullHeight = sorted.length * ROW_HEIGHT;

	return (
		<div className='rounded-xl border border-white/10 bg-white/5 p-4'>
			<div className='mb-3 flex items-baseline justify-between'>
				<p className='text-xs uppercase tracking-wider text-white/40'>
					trade history ({data.length})
				</p>
				<p className={`text-sm font-medium ${isPos ? 'text-green-400' : 'text-red-400'}`}>
					{totalPnl >= 0 ? '+' : ''}
					{new Intl.NumberFormat('en-US', {
						style: 'currency',
						currency: 'USD',
					}).format(totalPnl)}
				</p>
			</div>

			<div
				className='overflow-hidden transition-all duration-300 ease-in-out'
				style={{
					maxHeight: expanded ? fullHeight : collapsedHeight,
				}}
			>
				{sorted.map((trade, i) => (
					<TradeRow key={`${trade.date}-${trade.symbol}-${trade.action}-${i}`} trade={trade} />
				))}
			</div>

			{hasMore && (
				<button
					onClick={() => setExpanded((prev) => !prev)}
					className='mt-2 flex w-full items-center justify-center gap-1 rounded-lg py-2 text-xs text-white/30 transition-colors hover:bg-white/5 hover:text-white/60 cursor-pointer'
				>
					<span>{expanded ? 'show less' : `${sorted.length - PREVIEW_COUNT} more`}</span>

					<ChevronDownIcon
						className='h-3 w-3 transition-transform duration-300'
						style={{
							transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
						}}
					/>
				</button>
			)}
		</div>
	);
}

export default TradesCard;
