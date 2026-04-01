import type { Trade } from '@/shared/types/trades';

interface IPositionRow {
	symbol: string;
	stop: number;
	trade?: Trade;
	isLast?: boolean;
}

function PositionRow({ symbol, stop, trade, isLast = false }: IPositionRow) {
	const usd = (n: number) =>
		new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

	const entryValue = trade ? trade.shares * trade.price : null;
	const stopPct = trade ? (((stop - trade.price) / trade.price) * 100).toFixed(1) : null;

	return (
		<div
			className={`flex items-center justify-between py-3 ${isLast ? '' : 'border-b border-white/5'}`}
		>
			<div>
				<p className='text-sm font-medium text-white'>{symbol}</p>
				{trade && (
					<p className='text-xs text-white/40'>
						{trade.shares.toFixed(4)} shares @ {usd(trade.price)}
					</p>
				)}
				{entryValue && <p className='text-xs text-white/40'>value {usd(entryValue)}</p>}
			</div>
			<div className='text-right'>
				<p className='text-sm text-white/70'>stop {usd(stop)}</p>
				{stopPct && <p className='text-xs text-red-400/70'>{stopPct}% from entry</p>}
			</div>
		</div>
	);
}

export default PositionRow;
