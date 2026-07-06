import DecisionCardRow from '@/features/decisions/components/atoms/DecisionCardRow';
import Card from '@/shared/components/atoms/Card';
import ShowMoreButton from '@/shared/components/atoms/ShowMoreButton';
import { useExpandable } from '@/shared/hooks/useExpandable';
import type { DecisionEntry } from '@/shared/types/decisions';

interface IDecisionsCard {
	data: DecisionEntry[];
}

function DecisionsCard({ data }: IDecisionsCard) {
	const latest = data[data.length - 1];
	const sorted = latest
		? [...latest.candidates].sort((a, b) => (b.momentum ?? 0) - (a.momentum ?? 0))
		: [];

	const { expanded, toggle, hasMore, hiddenCount, previewCount } = useExpandable(sorted.length, 3);

	if (!latest) return null;

	const preview = sorted.slice(0, previewCount);
	const extra = sorted.slice(previewCount);

	return (
		<Card title='last decisions' badge={<p className='text-xs text-white/30'>{latest.date}</p>}>
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
				data-testid='decision-grid-container'
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
		</Card>
	);
}

export default DecisionsCard;
