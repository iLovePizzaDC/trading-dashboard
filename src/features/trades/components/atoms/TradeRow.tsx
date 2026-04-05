import type { Trade } from '@/shared/types/trades';

const reasonLabel: Record<string, string> = {
	stop_triggered: 'stop hit',
	sma200_break: 'sma200 break',
	momentum_negative: 'momentum drop',
};

interface ITradeRow {
	trade: Trade;
	isLast?: boolean;
}

function TradeRow({ trade, isLast = false }: ITradeRow) {
	const usd = (n: number) =>
		new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

	const isBuy = trade.action === 'buy';

	return (
		<div
			className={`h-full flex items-center justify-between ${
				isLast ? '' : 'border-b border-white/5'
			}`}
		>
			<div className='flex items-center gap-3 min-w-0'>
				<span
					className={`w-8 text-center text-[10px] font-medium uppercase ${
						isBuy ? 'text-green-400' : 'text-red-400'
					}`}
				>
					{trade.action}
				</span>

				<div className='min-w-0'>
					<p className='text-sm font-medium text-white truncate'>{trade.symbol}</p>
					<p className='text-xs text-white/40 truncate'>
						{trade.shares.toFixed(4)} @ {usd(trade.price)}
					</p>
				</div>
			</div>

			<div className='text-right min-w-0'>
				{trade.pnl !== undefined ? (
					<p
						className={`text-sm font-medium truncate ${
							trade.pnl >= 0 ? 'text-green-400' : 'text-red-400'
						}`}
					>
						{usd(trade.pnl)}
					</p>
				) : (
					trade.stop_price && (
						<p className='text-sm text-white/40 truncate'>stop {usd(trade.stop_price)}</p>
					)
				)}

				<p className='text-xs text-white/30 truncate'>
					{trade.reason ? (reasonLabel[trade.reason] ?? trade.reason) : trade.date}
				</p>
			</div>
		</div>
	);
}

export default TradeRow;
