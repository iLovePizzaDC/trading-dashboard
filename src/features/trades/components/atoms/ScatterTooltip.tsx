import { useRotateSymbolName } from '@/features/trades/hooks/useRotateScatterSymbolName';
import type { ScatterPoint } from '@/features/trades/types/scatter';
import { SECTOR_MAP } from '@/shared/constants/sectors';
import { isPos, usd } from '@/shared/utils/currency';

interface IScatterTooltip {
	active?: boolean;
	payload?: { payload: ScatterPoint }[];
}

function ScatterTooltip({ active, payload }: IScatterTooltip) {
	const scatterPoint = payload?.[0]?.payload;

	const { showSectorName } = useRotateSymbolName(scatterPoint);

	if (!active || !scatterPoint) return null;

	const pointPositive = isPos(scatterPoint.pnl);
	const sectorName = SECTOR_MAP[scatterPoint.symbol];

	return (
		<div className='bg-black/80 border border-white/20 rounded-lg px-3 py-2 backdrop-blur-sm shadow-lg text-xs'>
			<p className='relative mb-1 h-4 font-medium text-white'>
				<span
					className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
						showSectorName ? 'opacity-100' : 'opacity-0'
					}`}
				>
					{sectorName}
				</span>
				<span
					className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
						showSectorName ? 'opacity-0' : 'opacity-100'
					}`}
				>
					{scatterPoint.symbol}
				</span>
			</p>
			<p className='text-white/60'>entry {usd(scatterPoint.entryPrice)}</p>
			<p className='text-white/60'>exit {usd(scatterPoint.exitPrice)}</p>
			<p className={`mt-1 font-medium ${pointPositive ? 'text-green-400' : 'text-red-400'}`}>
				{pointPositive ? '+' : ''}
				{usd(scatterPoint.pnl)}
			</p>
			<p className='text-white/40'>{scatterPoint.date}</p>
		</div>
	);
}

export default ScatterTooltip;
