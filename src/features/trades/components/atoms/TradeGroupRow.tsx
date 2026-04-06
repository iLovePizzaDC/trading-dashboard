import TradeEntry from '@/features/trades/components/atoms/TradeEntry'; // TODO DO NOT USE ATOMS IN ATOMS!
import type { TradeGroup } from '@/features/trades/types/trades-card';
import { usd } from '@/shared/utils/currency';
import { useState } from 'react';

interface ITradeGroupRow {
	group: TradeGroup;
}

function TradeGroupRow({ group }: ITradeGroupRow) {
	const [expanded, setExpanded] = useState(false);

	const hasPnl = group.closedPnl !== 0;
	const pnlPos = group.closedPnl >= 0;
	const hasMultiple = group.entries.length > 1;

	const reversed = [...group.entries].reverse();
	const latestEntry = reversed[0];
	const olderEntries = reversed.slice(1);
	const hiddenCount = olderEntries.length;

	return (
		<div>
			<button
				onClick={() => hasMultiple && setExpanded((v) => !v)}
				className={`w-full flex items-center justify-between mb-2 group/header ${
					hasMultiple ? 'cursor-pointer' : 'cursor-default'
				}`}
			>
				<div className='flex items-center gap-2'>
					<span
						className='w-2 h-2 rounded-full shrink-0'
						style={{ backgroundColor: group.color }}
					/>
					<span className='text-[11px] font-semibold tracking-widest text-white/75'>
						{group.symbol}
					</span>
					{hasMultiple && (
						<svg
							className={`w-3 h-3 text-white/25 transition-transform duration-300 group-hover/header:text-white/50 ${
								expanded ? 'rotate-180' : ''
							}`}
							viewBox='0 0 12 12'
							fill='none'
							stroke='currentColor'
							strokeWidth='1.5'
							strokeLinecap='round'
							strokeLinejoin='round'
						>
							<path d='M2 4l4 4 4-4' />
						</svg>
					)}
				</div>

				<div className='flex items-center gap-2'>
					{!expanded && hasMultiple && (
						<span className='text-[9px] text-white/20 transition-opacity duration-200'>
							+{hiddenCount} older
						</span>
					)}
					{hasPnl && (
						<span
							className={`text-[11px] font-medium ${pnlPos ? 'text-green-400' : 'text-red-400'}`}
						>
							{usd(group.closedPnl)}
						</span>
					)}
					{group.isOpen && (
						<span className='text-[9px] uppercase tracking-widest text-white/30 border border-white/10 px-1.5 py-0.5 rounded'>
							open
						</span>
					)}
				</div>
			</button>

			<div className='pl-1'>
				<TradeEntry
					trade={latestEntry}
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
							{olderEntries.map((trade, i) => (
								<div
									key={`${trade.symbol}-${trade.date}-${i}`}
									style={{
										opacity: expanded ? 1 : 0,
										transform: expanded ? 'translateY(0)' : 'translateY(-6px)',
										transition: `opacity 220ms ease ${i * 40}ms, transform 220ms ease ${i * 40}ms`,
									}}
								>
									<TradeEntry
										trade={trade}
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

export default TradeGroupRow;
