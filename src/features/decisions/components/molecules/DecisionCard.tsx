import DecisionRow from '@/features/decisions/components/atoms/DecisionRow';
import ShowMoreButton from '@/shared/components/atoms/ShowMoreButton';
import { useExpandable } from '@/shared/hooks/useExpandable';
import type { DecisionEntry } from '@/shared/types/decisions';

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
					transition: 'grid-template-rows 0.25s ease',
				}}
			>
				<div style={{ overflow: 'hidden' }}>
					{extra.map((c) => (
						<div key={c.symbol}>
							<DecisionRow candidate={c} />
						</div>
					))}
				</div>
			</div>

			{hasMore && <ShowMoreButton toggle={toggle} expanded={expanded} hiddenCount={hiddenCount} />}
		</div>
	);
}

export default DecisionsCard;
