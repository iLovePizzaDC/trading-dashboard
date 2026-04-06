import { SORT_LABELS } from '@/features/sector/constants/sectors';
import type { SortKey } from '@/features/sector/types/sector-breakdown';
import { calcSectorStats } from '@/features/sector/utils/sector-breakdown';
import type { DecisionEntry } from '@/shared/types/decisions';
import type { Trade } from '@/shared/types/trades';
import { usd } from '@/shared/utils/currency';
import { useState } from 'react';

interface ISectorBreakdown {
	decisions: DecisionEntry[];
	trades: Trade[];
}

function SectorBreakdown({ decisions, trades }: ISectorBreakdown) {
	const [sortBy, setSortBy] = useState<SortKey>('timesSelected');

	const stats = calcSectorStats(decisions, trades);
	const sorted = [...stats].sort((a, b) => b[sortBy] - a[sortBy]);

	const maxSelected = Math.max(...stats.map((s) => s.timesSelected), 1);

	return (
		<div className='rounded-xl border border-white/10 bg-linear-to-br from-white/5 to-white/0 p-4'>
			<div className='mb-3 flex items-center justify-between'>
				<p className='text-xs uppercase tracking-wider text-white/40'>sector breakdown</p>
				<div className='flex rounded-lg bg-linear-to-br from-white/5 to-white/0'>
					{(Object.keys(SORT_LABELS) as SortKey[]).map((key) => (
						<button
							key={key}
							onClick={() => setSortBy(key)}
							className={`rounded-md px-2 py-px text-[10px] transition-all cursor-pointer ${
								sortBy === key ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'
							}`}
						>
							{SORT_LABELS[key]}
						</button>
					))}
				</div>
			</div>

			<div className='space-y-2'>
				{sorted.map((s) => (
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
		</div>
	);
}

export default SectorBreakdown;
