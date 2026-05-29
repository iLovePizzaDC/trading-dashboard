import DecisionHistoryRow from '@/features/decisions/components/atoms/DecisionHistoryRow';
import { useDecisionVirtualizer } from '@/features/decisions/hooks/useDecisionVirtualizer';
import Card from '@/shared/components/atoms/Card';
import type { DecisionEntry } from '@/shared/types/decisions';
import { useRef } from 'react';

interface IDecisionHistory {
	data: DecisionEntry[];
}

const CARD_HEIGHT = 97;
const CARD_GAP = 10;
const ROW_HEIGHT = CARD_HEIGHT + CARD_GAP;
const MAX_HEIGHT = 256;

// TODO automatically hide shadow on bottom when user reaches bottom
function DecisionHistory({ data }: IDecisionHistory) {
	const parentRef = useRef<HTMLDivElement>(null);

	const sorted = [...data].sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''));

	const rowVirtualizer = useDecisionVirtualizer(sorted.length, parentRef, ROW_HEIGHT);

	const canScroll = rowVirtualizer.getTotalSize() > MAX_HEIGHT;

	return (
		<Card
			title='decision history'
			badge={<p className='text-xs text-white/30'>{sorted.length} entries</p>}
		>
			<div
				ref={parentRef}
				className='max-h-64 overflow-y-auto scrollbar-thin px-3 -mx-3'
				style={
					canScroll
						? {
								maskImage: 'linear-gradient(to bottom, black calc(100% - 40px), transparent 100%)',
								WebkitMaskImage:
									'linear-gradient(to bottom, black calc(100% - 40px), transparent 100%)',
							}
						: undefined
				}
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
		</Card>
	);
}

export default DecisionHistory;
