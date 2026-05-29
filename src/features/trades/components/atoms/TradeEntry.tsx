import { REASON_LABEL } from '@/features/trades/constants/trades-card';
import EntryRowLayout from '@/shared/components/atoms/EntryRowLayout';
import type { Trade } from '@/shared/types/trades';
import { usd } from '@/shared/utils/currency';

interface ITradeEntry {
	trade: Trade;
	color: string;
	isLast: boolean;
	currentStop?: number;
}

function TradeEntry({ trade, color, isLast, currentStop }: ITradeEntry) {
	const isBuy = trade.action === 'buy';

	const displayStop = isBuy ? (currentStop ?? trade.stop_price) : undefined;

	return (
		<EntryRowLayout
			color={color}
			isLast={isLast}
			dotOpacity={isBuy ? 1 : 0.55}
			renderLeft={
				<>
					<div className='flex items-center gap-1.5'>
						<span
							className={`text-[10px] font-medium uppercase shrink-0 ${isBuy ? 'text-green-400' : 'text-red-400'}`}
						>
							{trade.action}
						</span>
						<span className='text-xs text-white/55 truncate'>
							{trade.shares.toFixed(4)} @ {usd(trade.price)}
						</span>
					</div>
					<p className='text-[11px] text-white/25 mt-0.5 truncate'>
						{trade.reason ? (REASON_LABEL[trade.reason] ?? trade.reason) : trade.date}
					</p>
				</>
			}
			renderRight={
				trade.pnl !== undefined ? (
					<span
						className={`text-xs font-medium ${trade.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}
					>
						{usd(trade.pnl)}
					</span>
				) : displayStop ? (
					<span className='text-xs text-white/30'>stop {usd(displayStop)}</span>
				) : null
			}
		/>
	);
}

export default TradeEntry;
