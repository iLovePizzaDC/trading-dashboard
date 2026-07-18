import MetricItem from '@/features/summary/components/atoms/MetricItem';
import RegimeBadge from '@/features/summary/components/atoms/RegimeBadge';
import type { Regime } from '@/shared/constants/regime';
import { isPos, usd } from '@/shared/utils/currency';

interface IHeroCards {
  portfolioValue: number;
  profit: number;
  regime: Regime;
}

function HeroCards({ portfolioValue, profit, regime }: IHeroCards) {
  return (
    <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
      <div className='md:col-span-2'>
        <MetricItem
          label='portfolio value'
          value={usd(portfolioValue)}
          sub={`${profit >= 0 ? '+' : ''}${usd(profit)} profit`}
          positive={isPos(profit)}
          featured
          large
        />
      </div>

      <div
        className={`
						group relative rounded-xl border border-white/10
						bg-linear-to-br from-white/5 to-white/0
						p-4 transition-all duration-300 ease-out
						hover:border-white/20
						hover:from-white/[0.07] hover:to-purple-500/3
					`}
      >
        <div className='absolute inset-x-0 top-0 h-px rounded-t-xl bg-linear-to-r from-transparent via-white/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100' />

        <p className='text-xs uppercase tracking-wider text-white/40 transition-colors duration-300 group-hover:text-white/55'>
          regime
        </p>

        <RegimeBadge regime={regime} />

        <p className='text-xs text-white/30'>
          {regime === 'bullish' ? 'full exposure' : 'reduced exposure'}
        </p>
      </div>
    </div>
  );
}

export default HeroCards;
