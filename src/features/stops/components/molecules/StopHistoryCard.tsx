import StopHistoryGroupRow from '@/features/stops/components/atoms/StopHistoryGroupRow';
import type { StopHistory } from '@/shared/types/stops';
import { symbolColor } from '@/shared/utils/symbol-colors';
import { useEffect, useMemo, useRef, useState } from 'react';

export interface StopHistoryGroup {
	symbol: string;
	color: string;
	entries: Array<{ date: string; old_stop: number; new_stop: number }>;
	latestStop: number;
	totalChanges: number;
}

interface IStopHistoryCard {
	data: StopHistory;
}

function StopHistoryCard({ data }: IStopHistoryCard) {
	const scrollRef = useRef<HTMLDivElement>(null);
	const [canScroll, setCanScroll] = useState(false);

	const groups = useMemo<StopHistoryGroup[]>(() => {
		return Object.entries(data)
			.map(([symbol, history]) => {
				const sorted = [...history].sort((a, b) => b.date.localeCompare(a.date));
				return {
					symbol,
					color: symbolColor(symbol),
					entries: sorted,
					latestStop: sorted[0]?.new_stop ?? 0,
					totalChanges: sorted.length,
				};
			})
			.sort((a, b) => {
				const la = a.entries[0]?.date ?? '';
				const lb = b.entries[0]?.date ?? '';
				return lb.localeCompare(la);
			});
	}, [data]);

	useEffect(() => {
		const el = scrollRef.current;
		if (!el) return;

		const check = () => setCanScroll(el.scrollHeight > el.clientHeight);
		check();

		const ro = new ResizeObserver(check);
		ro.observe(el);
		return () => ro.disconnect();
	}, [groups]);

	const totalChanges = groups.reduce((sum, g) => sum + g.totalChanges, 0);

	return (
		<div className='rounded-xl border border-white/10 bg-linear-to-br from-white/5 to-white/0 p-4 transition-colors duration-300 hover:border-white/20'>
			<div className='mb-3 flex items-baseline justify-between'>
				<div className='flex items-center gap-2'>
					<span className='w-1 h-4 bg-purple-500 rounded-full' />
					<p className='text-xs uppercase tracking-wider text-white/40'>
						stop history ({totalChanges})
					</p>
				</div>
				<p className='text-xs text-white/30'>{groups.length} symbols</p>
			</div>

			<div
				ref={scrollRef}
				className='max-h-64 overflow-y-auto pr-3 -mr-3 [scrollbar-width:thin]'
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
				{groups.map((group, index) => (
					<div key={group.symbol}>
						<StopHistoryGroupRow group={group} />
						{index < groups.length - 1 && (
							<div className='bg-linear-to-r from-transparent via-white/20 to-transparent h-px my-3' />
						)}
					</div>
				))}
			</div>
		</div>
	);
}

export default StopHistoryCard;
