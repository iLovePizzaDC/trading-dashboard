import { MONTHS } from '@/features/equity/constants/heatmap';
import type { MonthlyReturn } from '@/features/equity/types/heatmap';
import { fmt, usd } from '@/shared/utils/currency';

interface IDetailPanel {
  entry: MonthlyReturn;
}

function DetailPanel({ entry }: IDetailPanel) {
  const abs = entry.endEquity - entry.startEquity;

  return (
    <div className='grid grid-cols-2 sm:grid-cols-4 gap-2 rounded-lg border border-white/5 bg-linear-to-br from-white/5 to-white/0 px-4 py-3'>
      <div className='min-w-0'>
        <p className='text-[10px] uppercase tracking-wider text-white/30'>period</p>
        <p className='text-xs text-white/70'>
          {MONTHS[entry.month - 1]} {entry.year}
        </p>
      </div>

      <div className='min-w-0'>
        <p className='text-[10px] uppercase tracking-wider text-white/30'>return</p>
        <p
          className={`text-xs font-medium tabular-nums ${entry.return >= 0 ? 'text-green-400' : 'text-red-400'}`}
        >
          {fmt(entry.return)}
        </p>
      </div>

      <div className='min-w-0'>
        <p className='text-[10px] uppercase tracking-wider text-white/30'>p&l</p>
        <p
          className={`text-xs font-medium tabular-nums ${abs >= 0 ? 'text-green-400' : 'text-red-400'}`}
        >
          {fmt(abs, false)}
        </p>
      </div>

      <div className='min-w-0'>
        <p className='text-[10px] uppercase tracking-wider text-white/30'>start - end</p>
        <p className='text-xs tabular-nums text-white/50'>
          {usd(entry.startEquity)} - {usd(entry.endEquity)}
        </p>
      </div>
    </div>
  );
}

export default DetailPanel;
