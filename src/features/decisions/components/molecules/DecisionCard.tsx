import DecisionRow from '@/features/decisions/components/atoms/DecisionRow';
import { useExpandable } from '@/shared/hooks/useExpandable';
import type { DecisionEntry } from '@/shared/types/decisions';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface IDecisionsCard {
	data: DecisionEntry[];
}

function DecisionsCard({ data }: IDecisionsCard) {
	const latest = data[data.length - 1];
	if (!latest) return null;

	const sorted = [...latest.candidates].sort((a, b) => (b.momentum ?? 0) - (a.momentum ?? 0));

	const { expanded, toggle, hasMore, hiddenCount, previewCount } = useExpandable(sorted.length, 3);

	const preview = sorted.slice(0, previewCount);
	const extra = sorted.slice(previewCount);

	return (
		<div className='rounded-xl border border-white/10 bg-white/5 p-4'>
			<div className='mb-3 flex items-baseline justify-between'>
				<p className='text-xs uppercase tracking-wider text-white/40'>last decisions</p>
				<p className='text-xs text-white/30'>{latest.date}</p>
			</div>

			{preview.map((c) => (
				<DecisionRow key={c.symbol} candidate={c} />
			))}

			<div
				style={{
					display: 'grid',
					gridTemplateRows: expanded ? '1fr' : '0fr',
					transition: 'grid-template-rows 0.35s ease',
				}}
			>
				<div style={{ overflow: 'hidden' }}>
					{extra.map((c, i) => (
						<div
							key={c.symbol}
							style={{
								opacity: expanded ? 1 : 0,
								transform: expanded ? 'translateY(0)' : 'translateY(-6px)',
								transition: `opacity 0.2s ease ${expanded ? i * 50 : (extra.length - 1 - i) * 50}ms,
                             transform 0.2s ease ${expanded ? i * 50 : (extra.length - 1 - i) * 50}ms`,
							}}
						>
							<DecisionRow candidate={c} />
						</div>
					))}
				</div>
			</div>

			{hasMore && (
				<button
					onClick={toggle}
					className='mt-2 flex w-full items-center justify-center gap-1 rounded-lg py-2 text-xs text-white/30 transition-colors hover:bg-white/5 hover:text-white/60 cursor-pointer'
				>
					<span>{expanded ? 'show less' : `${hiddenCount} more`}</span>
					<ChevronDownIcon
						className='h-3 w-3 transition-transform duration-300'
						style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
					/>
				</button>
			)}
		</div>
	);
}

export default DecisionsCard;
