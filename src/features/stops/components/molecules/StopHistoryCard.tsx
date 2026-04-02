import StopHistoryRow from '@/features/stops/components/atoms/StopHistoryRow';
import type { StopHistory } from '@/shared/types/stops';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';

interface IStopHistoryCard {
	data: StopHistory;
}

const ROW_HEIGHT = 42;

function StopHistoryCard({ data }: IStopHistoryCard) {
	const parentRef = useRef<HTMLDivElement>(null);

	const entries = Object.entries(data).flatMap(([symbol, history]) =>
		history.map((entry) => ({ symbol, entry })),
	);

	const sorted = entries.sort((a, b) => b.entry.date.localeCompare(a.entry.date));

	const rowVirtualizer = useVirtualizer({
		count: sorted.length,
		getScrollElement: () => parentRef.current,
		estimateSize: () => ROW_HEIGHT,
		overscan: 5,
	});

	return (
		<div className='rounded-xl border border-white/10 bg-linear-to-br from-white/5 to-white/0 p-4'>
			<div className='mb-3 flex items-baseline justify-between'>
				<p className='text-xs uppercase tracking-wider text-white/40'>stop history</p>
				<p className='text-xs text-white/30'>{sorted.length} adjustments</p>
			</div>

			<div
				ref={parentRef}
				className='overflow-y-auto max-h-52 pr-3 -mr-3 [scrollbar-width:thin]
				mask-[linear-gradient(to_bottom,black_calc(100%-40px),transparent_100%)]
				[-webkit-mask-image:linear-gradient(to_bottom,black_calc(100%-40px),transparent_100%)]'
			>
				<div
					style={{
						height: rowVirtualizer.getTotalSize(),
						position: 'relative',
					}}
				>
					{rowVirtualizer.getVirtualItems().map((virtualRow) => {
						const item = sorted[virtualRow.index];

						return (
							<div
								key={virtualRow.key}
								style={{
									position: 'absolute',
									top: 0,
									left: 0,
									width: '100%',
									transform: `translateY(${virtualRow.start}px)`,
								}}
							>
								<StopHistoryRow
									symbol={item.symbol}
									entry={item.entry}
									isLast={virtualRow.index === sorted.length - 1}
								/>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}

export default StopHistoryCard;
