import MetricItem from '@/features/summary/components/atoms/MetricItem';
import RegimeBadge from '@/features/summary/components/atoms/RegimeBadge';
import type { Summary } from '@/shared/types/summary';
import { usd } from '@/shared/utils/currency';

interface ISummaryCard {
	summary: Summary;
}

function SummaryCard({ summary }: ISummaryCard) {
	const isPos = (n: number) => n >= 0;
	const pct = (n: number) => `${n >= 0 ? '+' : ''}${n.toFixed(2)}%`;

	const spy4wDiff =
		summary.rolling_4w !== null && summary.spy_4w !== null
			? summary.rolling_4w - summary.spy_4w
			: null;

	const startValue = summary.portfolio_value / (1 + summary.total_return / 100);
	const absReturn = summary.portfolio_value - startValue;

	return (
		<div className='space-y-4'>
			<div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
				<div className='col-span-2'>
					<MetricItem
						label='portfolio value'
						value={usd(summary.portfolio_value)}
						sub={`${absReturn >= 0 ? '+' : ''}${usd(absReturn)} since start`}
						positive={isPos(absReturn)}
						featured
						large
					/>
				</div>

				<MetricItem
					label='total return'
					value={pct(summary.total_return)}
					sub='since inception'
					positive={isPos(summary.total_return)}
				/>

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

					<RegimeBadge regime={summary.regime} />

					<p className='text-xs text-white/30'>
						{summary.regime === 'bullish' ? 'full exposure' : 'reduced exposure'}
					</p>
				</div>
			</div>

			<div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
				<MetricItem
					label='4-week return'
					value={summary.rolling_4w !== null ? pct(summary.rolling_4w) : 'n/a'}
					sub={summary.spy_4w !== null ? `SPY ${pct(summary.spy_4w)}` : undefined}
					positive={summary.rolling_4w !== null ? isPos(summary.rolling_4w) : undefined}
				/>

				<MetricItem
					label='vs SPY'
					value={spy4wDiff !== null ? pct(spy4wDiff) : 'n/a'}
					sub='4-week delta'
					positive={spy4wDiff !== null ? isPos(spy4wDiff) : undefined}
				/>

				<MetricItem
					label='max drawdown'
					value={pct(summary.max_dd)}
					sub='since inception'
					positive={isPos(summary.max_dd)}
				/>

				<MetricItem
					label='sharpe ratio'
					value={summary.sharpe.toFixed(2)}
					sub='annualised'
					positive={isPos(summary.sharpe)}
				/>
			</div>
		</div>
	);
}

export default SummaryCard;
