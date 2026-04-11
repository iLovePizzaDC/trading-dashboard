import { SECTOR_MAP } from '@/shared/constants/sectors';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

interface IGroupRowLayout<T> {
	symbol: string;
	color: string;
	entries: T[];
	getEntryKey: (entry: T, index: number) => string;
	renderBadge: (expanded: boolean) => React.ReactNode;
	renderEntry: (entry: T, color: string, isLast: boolean) => React.ReactNode;
	reverseEntries?: boolean;
}

function GroupRowLayout<T>({
	symbol,
	color,
	entries,
	getEntryKey,
	renderBadge,
	renderEntry,
	reverseEntries = false,
}: IGroupRowLayout<T>) {
	const [expanded, setExpanded] = useState(false);

	const ordered = reverseEntries ? [...entries].reverse() : entries;
	const latestEntry = ordered[0];
	const olderEntries = ordered.slice(1);
	const hasMultiple = entries.length > 1;
	const symbolName = SECTOR_MAP[symbol];

	return (
		<div>
			<button
				onClick={() => hasMultiple && setExpanded((v) => !v)}
				className={`w-full flex items-center justify-between mb-2 group/header ${
					hasMultiple ? 'cursor-pointer' : 'cursor-default'
				}`}
			>
				<div className='flex items-center gap-2 min-w-0'>
					<span className='w-2 h-2 rounded-full shrink-0' style={{ backgroundColor: color }} />
					<div className='flex flex-col min-w-0'>
						<span className='text-[11px] font-semibold tracking-widest text-white/75 leading-tight'>
							{symbol}
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
					{renderBadge(expanded)}
				</div>
			</button>

			<div className='pl-1'>
				{renderEntry(latestEntry, color, !expanded || olderEntries.length === 0)}

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
									key={getEntryKey(entry, i)}
									style={{
										opacity: expanded ? 1 : 0,
										transform: expanded ? 'translateY(0)' : 'translateY(-6px)',
										transition: `opacity 220ms ease ${i * 40}ms, transform 220ms ease ${i * 40}ms`,
									}}
								>
									{renderEntry(entry, color, i === olderEntries.length - 1)}
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

export default GroupRowLayout;
