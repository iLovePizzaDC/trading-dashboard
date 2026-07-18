import type { ScatterPoint } from '@/features/trades/types/scatter';
import { useRotateSectorName } from '@/shared/hooks/useRotateSymbolName';
import { isPos, usd } from '@/shared/utils/currency';

interface IScatterTooltip {
  active?: boolean;
  payload?: { payload: ScatterPoint }[];
}

function ScatterTooltip({ active, payload }: IScatterTooltip) {
  const scatterPoint = payload?.[0]?.payload;

  const { displayName, visible } = useRotateSectorName(scatterPoint?.symbol);

  if (!active || !scatterPoint) return null;

  const pointPositive = isPos(scatterPoint.pnl);

  return (
    <div className='bg-black/80 border border-white/20 rounded-lg px-3 py-2 backdrop-blur-sm shadow-lg text-xs'>
      <p
        className={`mb-1 font-medium text-white transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
      >
        {displayName}
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
