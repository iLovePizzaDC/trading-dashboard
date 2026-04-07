import DecisionHistoryRow from '@/features/decisions/components/atoms/DecisionHistoryRow';
import type { DecisionEntry } from '@/shared/types/decisions';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';

interface IDecisionHistory {
	data: DecisionEntry[];
}

const CARD_HEIGHT = 97;
const CARD_GAP = 10;
const ROW_HEIGHT = CARD_HEIGHT + CARD_GAP;

function DecisionHistory({ data }: IDecisionHistory) {
	const parentRef = useRef<HTMLDivElement>(null);

	const sorted = [...data].sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''));

	const rowVirtualizer = useVirtualizer({
		count: sorted.length,
		getScrollElement: () => parentRef.current,
		estimateSize: () => ROW_HEIGHT,
		overscan: 6,
	});

	return (
		<div className='rounded-xl border border-white/10 bg-linear-to-br from-white/5 to-white/0 p-4 transition-colors duration-300 hover:border-white/20'>
			<div className='mb-4 flex items-baseline justify-between'>
				<div className='flex items-center gap-2'>
					<span className='w-1 h-4 bg-purple-500 rounded-full' />
					<p className='text-xs uppercase tracking-wider text-white/40'>decision history</p>
				</div>
				<p className='text-xs text-white/30'>{sorted.length} entries</p>
			</div>

			<div
				ref={parentRef}
				className='max-h-64 overflow-y-auto [scrollbar-width:thin]
					px-3 -mx-3 py-2 -my-2
					mask-[linear-gradient(to_bottom,black_calc(100%-40px),transparent_100%)]
					[-webkit-mask-image:linear-gradient(to_bottom,black_calc(100%-40px),transparent_100%)]'
			>
				<div style={{ height: rowVirtualizer.getTotalSize(), position: 'relative' }}>
					{rowVirtualizer.getVirtualItems().map((virtualRow) => {
						const decision = sorted[virtualRow.index];

						return (
							<div
								key={virtualRow.key}
								style={{
									position: 'absolute',
									top: 0,
									left: 0,
									width: '100%',
									height: ROW_HEIGHT,
									paddingBottom: CARD_GAP,
									transform: `translateY(${virtualRow.start}px)`,
								}}
							>
								<DecisionHistoryRow decision={decision} cardHeight={CARD_HEIGHT} />
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}

export default DecisionHistory;
