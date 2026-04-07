import { REASON_LABEL } from '@/features/trades/constants/trades-card';
import type { Trade } from '@/shared/types/trades';
import { usd } from '@/shared/utils/currency';

interface ITradeEntry {
	trade: Trade;
	color: string;
	isLast: boolean;
}

function TradeEntry({ trade, color, isLast }: ITradeEntry) {
	const isBuy = trade.action === 'buy';

	return (
		<div className='flex gap-2.5'>
			<div className='flex flex-col items-center w-3 shrink-0'>
				<div
					className='w-2 h-2 rounded-full mt-1.75 shrink-0 z-10'
					style={{ backgroundColor: color, opacity: isBuy ? 1 : 0.55 }}
				/>
				{!isLast && (
					<div className='w-px flex-1 min-h-2' style={{ backgroundColor: color, opacity: 0.2 }} />
				)}
			</div>

			<div
				className={`flex-1 flex items-start justify-between min-w-0 ${
					isLast ? '' : 'border-b border-white/5'
				}`}
			>
				<div className='min-w-0'>
					<div className='flex items-center gap-1.5'>
						<span
							className={`text-[10px] font-medium uppercase shrink-0 ${
								isBuy ? 'text-green-400' : 'text-red-400'
							}`}
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
				</div>

				<div className='text-right shrink-0 ml-2'>
					{trade.pnl !== undefined ? (
						<span
							className={`text-xs font-medium ${
								trade.pnl >= 0 ? 'text-green-400' : 'text-red-400'
							}`}
						>
							{usd(trade.pnl)}
						</span>
					) : trade.stop_price ? (
						<span className='text-xs text-white/30'>stop {usd(trade.stop_price)}</span>
					) : null}
				</div>
			</div>
		</div>
	);
}

export default TradeEntry;
