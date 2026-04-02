import StopHistoryRow from '@/features/stops/components/atoms/StopHistoryRow';
import type { StopHistory } from '@/shared/types/stops';

interface IStopHistoryCard {
	data: StopHistory;
}

function StopHistoryCard({ data }: IStopHistoryCard) {
	const entries = Object.entries(data).flatMap(([symbol, history]) =>
		history.map((entry) => ({ symbol, entry })),
	);
	const sorted = entries.sort((a, b) => b.entry.date.localeCompare(a.entry.date));

	return (
		<div className='rounded-xl border border-white/10 bg-white/5 p-4'>
			<div className='mb-3 flex items-baseline justify-between'>
				<p className='text-xs uppercase tracking-wider text-white/40'>stop history</p>
				<p className='text-xs text-white/30'>{sorted.length} adjustments</p>
			</div>

			<div className='overflow-y-auto max-h-52 pr-3 -mr-3 [scrollbar-width:thin] mask-[linear-gradient(to_bottom,black_calc(100%-40px),transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_calc(100%-40px),transparent_100%)]'>
				{sorted.map((item, index) => (
					<StopHistoryRow
						key={`${item.symbol}-${item.entry.date}-${index}`}
						symbol={item.symbol}
						entry={item.entry}
						isLast={index === sorted.length - 1}
					/>
				))}
			</div>
		</div>
	);
}

export default StopHistoryCard;
