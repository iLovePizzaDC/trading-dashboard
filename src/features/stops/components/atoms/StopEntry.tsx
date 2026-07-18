import EntryRowLayout from '@/shared/components/layouts/EntryRowLayout';
import type { StopHistoryEntry } from '@/shared/types/stops';
import { usd } from '@/shared/utils/currency';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

interface IStopEntry {
  entry: StopHistoryEntry;
  color: string;
  isLast: boolean;
}

function StopEntry({ entry, color, isLast }: IStopEntry) {
  const isFirst = entry.old_stop === 0;
  const isRaise = entry.new_stop > entry.old_stop;

  const label = isFirst ? 'init' : isRaise ? 'raise' : 'lower';
  const labelColor = isFirst ? 'text-white/40' : isRaise ? 'text-green-400' : 'text-red-400';
  const valueColor = isFirst ? 'text-white/50' : isRaise ? 'text-green-400' : 'text-red-400';

  return (
    <EntryRowLayout
      color={color}
      isLast={isLast}
      dotOpacity={isRaise || isFirst ? 1 : 0.55}
      renderLeft={
        <>
          <div className='flex items-center gap-1.5'>
            <span className={`text-[10px] font-medium uppercase shrink-0 ${labelColor}`}>
              {label}
            </span>
            {!isFirst && (
              <span className='text-xs text-white/30 flex items-center gap-1 truncate'>
                {usd(entry.old_stop)}
                <ArrowRightIcon
                  className='h-2.5 w-2.5 text-white/20 shrink-0'
                  data-testid='arrow-indicator'
                />
              </span>
            )}
          </div>
          <p className='text-[11px] text-white/25 mt-0.5'>{entry.date}</p>
        </>
      }
      renderRight={
        <span className={`text-xs font-medium ${valueColor}`}>{usd(entry.new_stop)}</span>
      }
    />
  );
}

export default StopEntry;
