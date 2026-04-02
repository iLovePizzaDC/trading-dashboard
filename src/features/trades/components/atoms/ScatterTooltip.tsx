import type { ScatterPoint } from '@/features/trades/types/scatter';

interface IScatterTooltip {
	active?: boolean;
	payload?: { payload: ScatterPoint }[];
}

function ScatterTooltip({ active, payload }: IScatterTooltip) {
	if (!active || !payload?.length) return null;

	const d = payload[0].payload;
	const usd = (n: number) =>
		new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
	const isPos = d.pnl >= 0;

	return (
		<div className='rounded-lg border border-white/10 bg-[#1f2028] px-3 py-2 text-xs'>
			<p className='mb-1 font-medium text-white'>{d.symbol}</p>
			<p className='text-white/40'>entry {usd(d.entryPrice)}</p>
			<p className='text-white/40'>exit {usd(d.exitPrice)}</p>
			<p className={`mt-1 font-medium ${isPos ? 'text-green-400' : 'text-red-400'}`}>
				{isPos ? '+' : ''}
				{usd(d.pnl)}
			</p>
			<p className='text-white/20'>{d.date}</p>
		</div>
	);
}

export default ScatterTooltip;
