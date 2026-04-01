import StopHistoryRow from '@/features/stops/components/atoms/StopHistoryRow';
import ShowMoreButton from '@/shared/components/atoms/ShowMoreButton';
import { useExpandable } from '@/shared/hooks/useExpandable';
import type { StopHistory } from '@/shared/types/stops';

interface IStopHistoryCard {
	data: StopHistory;
}

function StopHistoryCard({ data }: IStopHistoryCard) {
	const entries = Object.entries(data).flatMap(([symbol, history]) =>
		history.map((entry) => ({ symbol, entry })),
	);
	const sorted = entries.sort((a, b) => b.entry.date.localeCompare(a.entry.date));

	const { expanded, toggle, hasMore, hiddenCount, previewCount } = useExpandable(sorted.length, 2);

	const preview = sorted.slice(0, previewCount);
	const extra = sorted.slice(previewCount);

	return (
		<div className='rounded-xl border border-white/10 bg-white/5 p-4'>
			<div className='mb-3 flex items-baseline justify-between'>
				<p className='text-xs uppercase tracking-wider text-white/40'>stop history</p>
				<p className='text-xs text-white/30'>{sorted.length} adjustments</p>
			</div>

			{preview.map((item, index) => (
				<StopHistoryRow
					key={`${item.symbol}-${item.entry.date}-${index}`}
					symbol={item.symbol}
					entry={item.entry}
					isLast={index === preview.length - 1 && (!expanded || extra.length === 0)}
				/>
			))}

			<div
				style={{
					display: 'grid',
					gridTemplateRows: expanded ? '1fr' : '0fr',
					transition: 'grid-template-rows 0.25s ease',
				}}
			>
				<div style={{ overflow: 'hidden' }}>
					{extra.map((item, index) => (
						<div key={`${item.symbol}-${item.entry.date}-${index}`}>
							<StopHistoryRow
								symbol={item.symbol}
								entry={item.entry}
								isLast={index === extra.length - 1}
							/>
						</div>
					))}
				</div>
			</div>

			{hasMore && <ShowMoreButton toggle={toggle} expanded={expanded} hiddenCount={hiddenCount} />}
		</div>
	);
}

export default StopHistoryCard;
