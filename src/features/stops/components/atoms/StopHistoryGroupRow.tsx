import StopHistoryEntryRow from '@/features/stops/components/atoms/StopHistoryEntryRow';
import type { StopHistoryGroup } from '@/features/stops/components/molecules/StopHistoryCard';
import { SECTOR_MAP } from '@/shared/constants/sectors';
import { usd } from '@/shared/utils/currency';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

interface IStopHistoryGroupRow {
	group: StopHistoryGroup;
}

function StopHistoryGroupRow({ group }: IStopHistoryGroupRow) {
	const [expanded, setExpanded] = useState(false);

	const hasMultiple = group.entries.length > 1;
	const latestEntry = group.entries[0];
	const olderEntries = group.entries.slice(1);

	const firstEntry = group.entries[group.entries.length - 1];
	const overallChange = group.latestStop - (firstEntry?.old_stop ?? 0);
	const isUp = overallChange >= 0;

	const symbolName = SECTOR_MAP[group.symbol];

	return (
		<div>
			<button
				onClick={() => hasMultiple && setExpanded((v) => !v)}
				className={`w-full flex items-center justify-between mb-2 group/header ${
					hasMultiple ? 'cursor-pointer' : 'cursor-default'
				}`}
			>
				<div className='flex items-center gap-2 min-w-0'>
					<span
						className='w-2 h-2 rounded-full shrink-0'
						style={{ backgroundColor: group.color }}
					/>
					<div className='flex flex-col min-w-0'>
						<span className='text-[11px] font-semibold tracking-widest text-white/75 leading-tight'>
							{group.symbol}
						</span>
						{symbolName && (
							<span className='text-[10px] text-white/30 font-normal tracking-normal leading-tight truncate'>
								{symbolName}
							</span>
						)}
					</div>
					{hasMultiple && (
						<ChevronDownIcon
							className={`w-3 h-3 text-white/25 shrink-0 transition-all duration-300 group-hover/header:text-white/50 ${
								expanded ? 'rotate-180' : ''
							}`}
						/>
					)}
				</div>

				<div className='flex items-center gap-2'>
					{!expanded && hasMultiple && (
						<span className='text-[9px] text-white/20 transition-opacity duration-200'>
							+{olderEntries.length} older
						</span>
					)}
					<span className={`text-[11px] font-medium ${isUp ? 'text-green-400' : 'text-red-400'}`}>
						{usd(group.latestStop)}
					</span>
				</div>
			</button>

			<div className='pl-1'>
				<StopHistoryEntryRow
					entry={latestEntry}
					color={group.color}
					isLast={!expanded || olderEntries.length === 0}
				/>

				{hasMultiple && (
					<div
						style={{
							display: 'grid',
							gridTemplateRows: expanded ? '1fr' : '0fr',
							transition: 'grid-template-rows 280ms cubic-bezier(0.4, 0, 0.2, 1)',
						}}
					>
						<div style={{ overflow: 'hidden' }}>
							{olderEntries.map((entry, i) => (
								<div
									key={`${entry.date}-${i}`}
									style={{
										opacity: expanded ? 1 : 0,
										transform: expanded ? 'translateY(0)' : 'translateY(-6px)',
										transition: `opacity 220ms ease ${i * 40}ms, transform 220ms ease ${i * 40}ms`,
									}}
								>
									<StopHistoryEntryRow
										entry={entry}
										color={group.color}
										isLast={i === olderEntries.length - 1}
									/>
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

export default StopHistoryGroupRow;
