import { SORT_LABELS } from '@/features/sector/constants/sectors';
import type { SortKey } from '@/features/sector/types/sector-breakdown';
import { calcSectorStats } from '@/features/sector/utils/sector-breakdown';
import Card from '@/shared/components/atoms/Card';
import Dropdown from '@/shared/components/atoms/Dropdown';
import Tooltip from '@/shared/components/atoms/Tooltip';
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
		defaultValue: 'timesBought',
		allValues: Object.keys(SORT_LABELS) as SortKey[],
	});

	const stats = calcSectorStats(decisions, trades);
	const maxBought = Math.max(...stats.map((s) => s.timesBought), 1);
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
						<p className='text-left text-xs font-medium text-white'>
							{s.sector ? (
								<Tooltip content={<p className='flex flex-col'>{s.sector}</p>}>{s.symbol}</Tooltip>
							) : (
								s.symbol
							)}
						</p>

						<div className='flex-1 flex flex-col gap-0.5 min-w-0'>
							<div className='flex items-center justify-end'>
								<p className='text-[10px] text-white/40 shrink-0'>{s.timesBought}x</p>
							</div>
							<div className='overflow-hidden rounded-full bg-white/5 h-1'>
								<div
									className='h-full rounded-full bg-purple-400/60 transition-all duration-300'
									style={{ width: `${(s.timesBought / maxBought) * 100}%` }}
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
