import { SORT_LABELS } from '@/features/sector/constants/sectors';
import type { SortKey } from '@/features/sector/types/sector-breakdown';
import { calcSectorStats } from '@/features/sector/utils/sector-breakdown';
import type { DecisionEntry } from '@/shared/types/decisions';
import type { Trade } from '@/shared/types/trades';
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
	const usd = (n: number) =>
		new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

	return (
		<div className='rounded-xl border border-white/10 bg-white/5 p-4'>
			<div className='mb-3 flex items-center justify-between'>
				<p className='text-xs uppercase tracking-wider text-white/40'>sector breakdown</p>
				<div className='flex flex-wrap gap-1'>
					{(Object.keys(SORT_LABELS) as SortKey[]).map((key) => (
						<button
							key={key}
							onClick={() => setSortBy(key)}
							className={`rounded px-1 py-px text-[10px] transition-colors ${
								sortBy === key ? 'bg-white/10 text-white/70' : 'text-white/30 hover:text-white/50'
							} cursor-pointer transition-all duration-300`}
						>
							{SORT_LABELS[key]}
						</button>
					))}
				</div>
			</div>

			<div className='space-y-1.5'>
				{sorted.map((s) => (
					<div
						key={s.symbol}
						className='flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-3'
					>
						<div className='flex items-center justify-between sm:w-40'>
							<p className='text-xs font-medium text-white'>{s.symbol}</p>

							{s.trades > 0 ? (
								<p
									className={`text-xs font-medium ${
										s.totalPnl >= 0 ? 'text-green-400' : 'text-red-400'
									}`}
								>
									{usd(s.totalPnl)}
								</p>
							) : (
								<p className='text-[10px] text-white/20'>no closes</p>
							)}
						</div>

						<div className='flex items-center gap-2 sm:flex-1'>
							<p className='hidden sm:block w-28 text-[10px] text-white/30 truncate'>{s.sector}</p>

							<div className='flex-1 overflow-hidden rounded-full bg-white/5 h-1'>
								<div
									className='h-full rounded-full bg-purple-400/60 transition-all duration-300'
									style={{ width: `${(s.timesSelected / maxSelected) * 100}%` }}
								/>
							</div>

							<p className='text-[10px] text-white/40'>{s.timesSelected}x</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

export default SectorBreakdown;
