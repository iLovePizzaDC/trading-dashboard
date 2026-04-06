import MetricItem from '@/features/summary/components/atoms/MetricItem';
import RegimeBadge from '@/features/summary/components/atoms/RegimeBadge';
import { useAnimatedNumber } from '@/shared/hooks/useAnimatedNumbers';
import type { Summary } from '@/shared/types/summary';
import { usd } from '@/shared/utils/currency';

interface ISummaryCard {
	lastRebalance: string;
	summary: Summary;
}

function SummaryCard({ lastRebalance, summary }: ISummaryCard) {
	const isPos = (n: number) => n >= 0;
	const pct = (raw: string, n: number) => `${n >= 0 ? '+' : ''}${raw}%`;

	const portfolioValueAnim = useAnimatedNumber(summary.portfolio_value, 2);
	const totalReturnAnim = useAnimatedNumber(summary.total_return, 2);
	const rolling4wAnim = useAnimatedNumber(summary.rolling_4w ?? 0, 2);
	const spy4wAnim = useAnimatedNumber(summary.spy_4w ?? 0, 2);
	const maxDdAnim = useAnimatedNumber(summary.max_dd, 2);
	const sharpeAnim = useAnimatedNumber(summary.sharpe, 2);

	const spy4wDiff =
		summary.rolling_4w !== null && summary.spy_4w !== null
			? summary.rolling_4w - summary.spy_4w
			: null;
	const spy4wDiffAnim = useAnimatedNumber(spy4wDiff ?? 0, 2);

	const startValue = summary.portfolio_value / (1 + summary.total_return / 100);
	const absReturn = summary.portfolio_value - startValue;
	const absReturnAnim = useAnimatedNumber(absReturn, 2);

	const nextRebalance = new Date(new Date(lastRebalance).getTime() + 30 * 24 * 60 * 60 * 1000);

	return (
		<div className='space-y-3'>
			<div className='flex justify-between text-xs text-white/30'>
				<span>
					last rebalance: {lastRebalance} (next: {nextRebalance.toISOString().split('T')[0]})
				</span>
			</div>

			<div className='grid grid-cols-2 gap-3 md:grid-cols-4'>
				<div className='col-span-2'>
					<MetricItem
						label='portfolio value'
						value={usd(Number(portfolioValueAnim))}
						sub={`${absReturn >= 0 ? '+' : ''}${usd(Number(absReturnAnim))} since start`}
						positive={isPos(absReturn)}
						featured
						large
					/>
				</div>

				<MetricItem
					label='total return'
					value={pct(totalReturnAnim, summary.total_return)}
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

			<div className='grid grid-cols-2 gap-3 md:grid-cols-4'>
				<MetricItem
					label='4-week return'
					value={summary.rolling_4w !== null ? pct(rolling4wAnim, summary.rolling_4w) : 'n/a'}
					sub={summary.spy_4w !== null ? `SPY ${pct(spy4wAnim, summary.spy_4w)}` : undefined}
					positive={summary.rolling_4w !== null ? isPos(summary.rolling_4w) : undefined}
				/>

				<MetricItem
					label='vs SPY'
					value={spy4wDiff !== null ? pct(spy4wDiffAnim, spy4wDiff) : 'n/a'}
					sub='4-week delta'
					positive={spy4wDiff !== null ? isPos(spy4wDiff) : undefined}
				/>

				<MetricItem
					label='max drawdown'
					value={pct(maxDdAnim, summary.max_dd)}
					sub='since inception'
					positive={isPos(summary.max_dd)}
				/>

				<MetricItem
					label='sharpe ratio'
					value={sharpeAnim}
					sub='annualised'
					positive={isPos(summary.sharpe)}
				/>
			</div>
		</div>
	);
}

export default SummaryCard;
