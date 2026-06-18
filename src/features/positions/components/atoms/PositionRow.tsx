import Tooltip from '@/shared/components/atoms/Tooltip';
import { SECTOR_MAP } from '@/shared/constants/sectors';
import type { Trade } from '@/shared/types/trades';
import { isPos, usd } from '@/shared/utils/currency';

interface IPositionRow {
	symbol: string;
	stop: number;
	trade?: Trade;
	isLast?: boolean;
}

function PositionRow({ symbol, stop, trade, isLast = false }: IPositionRow) {
	const entryValue = trade ? trade.shares * trade.price : null;
	const stopPct = trade ? ((stop - trade.price) / trade.price) * 100 : null;
	const symbolName = SECTOR_MAP[symbol];

	return (
		<div className={`flex items-center justify-between ${isLast ? 'pt-3' : 'py-3'}`}>
			<div>
				<p className='text-sm font-medium text-white'>
					{symbolName ? <Tooltip content={symbolName}>{symbol}</Tooltip> : symbol}
				</p>
				{trade && (
					<p className='text-xs text-white/40'>
						{trade.shares.toFixed(4)} shares @ {usd(trade.price)}
					</p>
				)}
				{entryValue && <p className='text-xs text-white/40'>value {usd(entryValue)}</p>}
			</div>
			<div className='text-right'>
				<p className='text-sm text-white/70'>stop {usd(stop)}</p>
				{stopPct !== null && (
					<p className={`text-xs ${isPos(stopPct) ? 'text-green-400/70' : 'text-red-400/70'}`}>
						{stopPct.toFixed(1)}% from entry
					</p>
				)}
			</div>
		</div>
	);
}

export default PositionRow;
