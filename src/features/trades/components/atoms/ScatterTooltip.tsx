import type { ScatterPoint } from '@/features/trades/types/scatter';
import { usd } from '@/shared/utils/currency';

interface IScatterTooltip {
	active?: boolean;
	payload?: { payload: ScatterPoint }[];
}

function ScatterTooltip({ active, payload }: IScatterTooltip) {
	if (!active || !payload?.length) return null;

	const d = payload[0].payload;
	const isPos = d.pnl >= 0;

	return (
		<div className='bg-black/80 border border-white/20 rounded-lg px-3 py-2 backdrop-blur-sm shadow-lg text-xs'>
			<p className='mb-1 font-medium text-white'>{d.symbol}</p>
			<p className='text-white/60'>entry {usd(d.entryPrice)}</p>
			<p className='text-white/60'>exit {usd(d.exitPrice)}</p>
			<p className={`mt-1 font-medium ${isPos ? 'text-green-400' : 'text-red-400'}`}>
				{isPos ? '+' : ''}
				{usd(d.pnl)}
			</p>
			<p className='text-white/40'>{d.date}</p>
		</div>
	);
}

export default ScatterTooltip;
