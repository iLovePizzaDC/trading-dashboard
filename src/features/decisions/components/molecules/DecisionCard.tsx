import DecisionRow from '@/features/decisions/components/atoms/DecisionRow';
import type { DecisionEntry } from '@/shared/types/decisions';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

const PREVIEW_COUNT = 5;
const ROW_HEIGHT = 44;

interface IDecisionsCard {
	data: DecisionEntry[];
}

function DecisionsCard({ data }: IDecisionsCard) {
	const [expanded, setExpanded] = useState(false);

	const latest = data[data.length - 1];
	if (!latest) return null;

	const sorted = [...latest.candidates].sort((a, b) => (b.momentum ?? 0) - (a.momentum ?? 0));

	const hasMore = sorted.length > PREVIEW_COUNT;

	const collapsedHeight = PREVIEW_COUNT * ROW_HEIGHT;
	const fullHeight = sorted.length * ROW_HEIGHT;

	return (
		<div className='rounded-xl border border-white/10 bg-white/5 p-4'>
			<div className='mb-3 flex items-baseline justify-between'>
				<p className='text-xs uppercase tracking-wider text-white/40'>last decisions</p>
				<p className='text-xs text-white/30'>{latest.date}</p>
			</div>

			<div
				className='overflow-hidden transition-all duration-300 ease-in-out'
				style={{
					maxHeight: expanded ? fullHeight : collapsedHeight,
				}}
			>
				{sorted.map((c) => (
					<DecisionRow key={c.symbol} candidate={c} />
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

export default DecisionsCard;
