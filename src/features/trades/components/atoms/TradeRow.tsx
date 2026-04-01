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
			className={`flex items-center justify-between py-2.5 ${isLast ? '' : 'border-b border-white/5'}`}
		>
			<div className='flex items-center gap-3'>
				<span
					className={`w-8 text-center text-[10px] font-medium uppercase ${isBuy ? 'text-green-400' : 'text-red-400'}`}
				>
					{trade.action}
				</span>
				<div>
					<p className='text-sm font-medium text-white'>{trade.symbol}</p>
					<p className='text-xs text-white/40'>
						{trade.shares.toFixed(4)} @ {usd(trade.price)}
					</p>
				</div>
			</div>
			<div className='text-right'>
				{trade.pnl !== undefined ? (
					<p
						className={`text-sm font-medium ${trade.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}
					>
						{trade.pnl >= 0 ? '+' : ''}
						{usd(trade.pnl)}
					</p>
				) : (
					trade.stop_price && <p className='text-sm text-white/40'>stop {usd(trade.stop_price)}</p>
				)}
				<p className='text-xs text-white/30'>
					{trade.reason ? (reasonLabel[trade.reason] ?? trade.reason) : trade.date}
				</p>
			</div>
		</div>
	);
}

export default TradeRow;
