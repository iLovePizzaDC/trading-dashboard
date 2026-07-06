import { SORT_LABELS } from '@/features/sector/constants/sectors';
import type { SortKey } from '@/features/sector/types/sector-breakdown';
import { calcSectorStats } from '@/features/sector/utils/sector-breakdown';
import Card from '@/shared/components/atoms/Card';
import Dropdown from '@/shared/components/atoms/Dropdown';
import { useFilterWithStorage } from '@/shared/hooks/useFilterWithStorage';
import type { DecisionEntry } from '@/shared/types/decisions';
import type { Trade } from '@/shared/types/trades';
import { usd } from '@/shared/utils/currency';

interface ISectorBreakdown {
	decisions: DecisionEntry[];
	trades: Trade[];
}

// TODO refactor into row like in DecisionCardRow
function SectorBreakdown({ decisions, trades }: ISectorBreakdown) {
	const { value: sortBy, setValue: setSortBy } = useFilterWithStorage({
		storageKey: 'sector-breakdown',
		data: trades,
		defaultValue: 'timesSelected',
		allValues: Object.keys(SORT_LABELS) as SortKey[],
	});

	const stats = calcSectorStats(decisions, trades);
	const maxSelected = Math.max(...stats.map((s) => s.timesSelected), 1);
	const sorted = [...stats].sort((a, b) => b[sortBy] - a[sortBy]);

	return (
		<Card
			title='sector breakdown'
			badge={
				<Dropdown
					trigger={<span>{SORT_LABELS[sortBy]}</span>}
					items={(Object.keys(SORT_LABELS) as SortKey[]).map((key) => ({
						key,
						label: SORT_LABELS[key],
						active: key === sortBy,
						onClick: () => setSortBy(key),
					}))}
					width='w-32'
				/>
			}
		>
			<div className='space-y-2 mb-2'>
				{sorted.map((s, i) => (
					<div key={s.symbol} className='flex items-center gap-3'>
						<p className='w-10 text-xs font-semibold text-white/75 tracking-widest shrink-0'>
							{s.symbol}
						</p>

						<div className='flex-1 flex flex-col gap-0.5 min-w-0'>
							<div className='flex items-center justify-between gap-2'>
								<p className='text-[10px] text-white/30 truncate'>{s.sector}</p>
								<p className='text-[10px] text-white/40 shrink-0'>{s.timesSelected}x</p>
							</div>
							<div className='overflow-hidden rounded-full bg-white/5 h-1'>
								<div
									className='h-full rounded-full bg-purple-400/60 transition-all duration-300'
									style={{ width: `${(s.timesSelected / maxSelected) * 100}%` }}
									data-testid={`sector-bar-${i}`}
								/>
							</div>
						</div>

						<div className='w-14 text-right shrink-0'>
							{s.trades > 0 ? (
								<p
									className={`text-xs font-medium ${s.totalPnl >= 0 ? 'text-green-400' : 'text-red-400'}`}
								>
									{usd(s.totalPnl)}
								</p>
							) : (
								<p className='text-[10px] text-white/20'>—</p>
							)}
						</div>
					</div>
				))}
			</div>
		</Card>
	);
}

export default SectorBreakdown;
