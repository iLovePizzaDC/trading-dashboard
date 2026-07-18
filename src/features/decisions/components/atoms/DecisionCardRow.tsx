import { STOP_REASON_LABEL } from '@/features/trades/constants/trades-card';
import Tooltip from '@/shared/components/atoms/Tooltip';
import { SECTOR_MAP } from '@/shared/constants/sectors';
import type { Candidate } from '@/shared/types/decisions';

interface IDecisionCardRow {
  candidate: Candidate;
  isLast?: boolean;
}

function DecisionCardRow({ candidate, isLast = false }: IDecisionCardRow) {
  const { symbol, momentum, passes_trend, selected, rejected_reason } = candidate;
  const pctLabel = momentum !== null ? (momentum * 100).toFixed(1) : null;
  const barWidth = momentum !== null ? Math.min(momentum * 100, 100) : 0;
  const symbolName = SECTOR_MAP[symbol];

  return (
    <div className={`flex items-center gap-3 py-2.5 ${isLast ? '' : 'border-b border-white/5'}`}>
      <div className='w-12 shrink-0'>
        <p className='text-left text-xs font-medium text-white'>
          {symbolName ? <Tooltip content={symbolName}>{symbol}</Tooltip> : symbol}
        </p>
      </div>
      <div className='flex-1 overflow-hidden rounded-full bg-linear-to-br from-white/5 to-white/0 h-1'>
        <div
          className={`h-full rounded-full transition-all ${selected ? 'bg-green-400' : !passes_trend ? 'bg-red-400' : 'bg-white/15'
            }`}
          style={{ width: `${barWidth}%` }}
          data-testid='decision-progress-bar'
        />
      </div>
      <p
        className='w-10 text-right text-xs text-white/40'
        title={momentum?.toString() ?? undefined}
      >
        {pctLabel ?? '—'}%
      </p>
      <p className='w-28 text-right text-xs'>
        {selected ? (
          <span className='text-green-400'>selected</span>
        ) : (
          <span className='text-white/30'>
            {rejected_reason ? (STOP_REASON_LABEL[rejected_reason] ?? rejected_reason) : '—'}
          </span>
        )}
      </p>
    </div>
  );
}

export default DecisionCardRow;
