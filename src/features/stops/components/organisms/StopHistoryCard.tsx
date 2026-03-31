import StopHistoryError from '@/features/stops/components/molecules/StopHistoryError';
import StopHistoryRow from '@/features/stops/components/molecules/StopHistoryRow';
import StopHistorySkeleton from '@/features/stops/components/molecules/StopHistorySkeleton';
import { fetchStopHistory } from '@/shared/api/data';
import { useFetch } from '@/shared/hooks/useFetch';

function StopHistoryCard() {
	const { data, loading, error } = useFetch(fetchStopHistory);

	if (loading) return <StopHistorySkeleton />;
	if (error || !data) return <StopHistoryError />;

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
			{sorted.map((item, i) => (
				<StopHistoryRow
					key={`${item.symbol}-${item.entry.date}-${i}`}
					symbol={item.symbol}
					entry={item.entry}
				/>
			))}
		</div>
	);
}

export default StopHistoryCard;
