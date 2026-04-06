import DecisionCardRow from '@/features/decisions/components/atoms/DecisionCardRow';
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
		<div className='rounded-xl border border-white/10 bg-linear-to-br from-white/5 to-white/0 p-4'>
			<div className='mb-3 flex items-baseline justify-between'>
				<p className='text-xs uppercase tracking-wider text-white/40'>last decisions</p>
				<p className='text-xs text-white/30'>{latest.date}</p>
			</div>

			{preview.map((candidate, index) => (
				<DecisionCardRow
					key={candidate.symbol}
					candidate={candidate}
					isLast={index === preview.length - 1 && (!expanded || extra.length === 0)}
				/>
			))}

			<div
				className={`grid transition-[grid-template-rows] duration-250 ease-in-out ${
					expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
				}`}
			>
				<div className='overflow-hidden'>
					{extra.map((candidate, index) => (
						<div key={candidate.symbol}>
							<DecisionCardRow candidate={candidate} isLast={index === extra.length - 1} />
						</div>
					))}
				</div>
			</div>

			{hasMore && <ShowMoreButton toggle={toggle} expanded={expanded} hiddenCount={hiddenCount} />}
		</div>
	);
}

export default DecisionsCard;
