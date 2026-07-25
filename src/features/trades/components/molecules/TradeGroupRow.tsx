import TradeEntry from '@/features/trades/components/atoms/TradeEntry';
import type { TradeGroup } from '@/features/trades/types/trades-card';
import GroupRowLayout from '@/shared/components/layouts/GroupRowLayout';
import { usd } from '@/shared/utils/currency';

interface ITradeGroupRow {
	group: TradeGroup;
}

function TradeGroupRow({ group }: ITradeGroupRow) {
	const hasPnl = group.closedPnl !== 0;
	const pnlPos = group.closedPnl >= 0;

	return (
		<GroupRowLayout
			symbol={group.symbol}
			color={group.color}
			entries={group.entries}
			reverseEntries
			getEntryKey={(trade, i) => `${trade.symbol}-${trade.date}-${i}`}
			renderBadge={() => (
				<>
					{hasPnl && (
						<span
							className={`text-[11px] font-medium ${pnlPos ? 'text-green-400' : 'text-red-400'}`}
						>
							{usd(group.closedPnl)}
						</span>
					)}
					{group.isOpen && (
						<span className='text-[9px] uppercase tracking-widest text-white/30 border border-white/10 px-1 rounded'>
							open
						</span>
					)}
				</>
			)}
			renderEntry={(trade, color, isLast) => (
				<TradeEntry trade={trade} color={color} isLast={isLast} currentStop={group.currentStop} />
			)}
		/>
	);
}

export default TradeGroupRow;
