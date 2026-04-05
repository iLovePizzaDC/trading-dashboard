import TradeRow from '@/features/trades/components/atoms/TradeRow';
import type { Trade } from '@/shared/types/trades';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';

interface ITradesCard {
	data: Trade[];
}

const ROW_HEIGHT = 56;

function TradesCard({ data }: ITradesCard) {
	const parentRef = useRef<HTMLDivElement>(null);

	const sorted = [...data].sort((a, b) => b.date.localeCompare(a.date));

	const totalPnl = data
		.filter((t) => t.pnl !== undefined)
		.reduce((sum, t) => sum + (t.pnl ?? 0), 0);

	const isPos = totalPnl >= 0;

	const totalPnlFormatted = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
	}).format(totalPnl);

	const rowVirtualizer = useVirtualizer({
		count: sorted.length,
		getScrollElement: () => parentRef.current,
		estimateSize: () => ROW_HEIGHT,
		overscan: 5,
	});

	return (
		<div className='rounded-xl border border-white/10 bg-linear-to-br from-white/5 to-white/0 p-4'>
			<div className='mb-3 flex items-baseline justify-between'>
				<p className='text-xs uppercase tracking-wider text-white/40'>
					trade history ({data.length})
				</p>
				<p className={`text-sm font-medium ${isPos ? 'text-green-400' : 'text-red-400'}`}>
					{totalPnlFormatted}
				</p>
			</div>

			<div
				ref={parentRef}
				className='max-h-52 overflow-y-auto pr-3 -mr-3 [scrollbar-width:thin]
					mask-[linear-gradient(to_bottom,black_calc(100%-40px),transparent_100%)]
					[-webkit-mask-image:linear-gradient(to_bottom,black_calc(100%-40px),transparent_100%)]'
			>
				<div style={{ height: rowVirtualizer.getTotalSize(), position: 'relative' }}>
					{rowVirtualizer.getVirtualItems().map((virtualRow) => {
						const trade = sorted[virtualRow.index];

						return (
							<div
								key={virtualRow.key}
								style={{
									position: 'absolute',
									top: 0,
									left: 0,
									width: '100%',
									height: ROW_HEIGHT,
									transform: `translateY(${virtualRow.start}px)`,
								}}
							>
								<TradeRow trade={trade} isLast={virtualRow.index === sorted.length - 1} />
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}

export default TradesCard;
