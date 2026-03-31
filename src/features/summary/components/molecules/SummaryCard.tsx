import MetricItem from '@/features/summary/components/atoms/MetricItem';
import RegimeBadge from '@/features/summary/components/atoms/RegimeBadge';
import type { Summary } from '@/shared/types/summary';

interface ISummaryCard {
	lastRebalance: string;
	lastWeeklyReport: string;
	summary: Summary;
}

function SummaryCard({ lastRebalance, lastWeeklyReport, summary }: ISummaryCard) {
	const isPos = (n: number) => n >= 0;
	const pct = (n: number) => `${n >= 0 ? '+' : ''}${n.toFixed(2)}%`;
	const usd = (n: number) =>
		new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

	const spy4wDiff =
		summary.rolling_4w !== null && summary.spy_4w !== null
			? summary.rolling_4w - summary.spy_4w
			: null;

	const startValue = summary.portfolio_value / (1 + summary.total_return / 100);
	const absReturn = summary.portfolio_value - startValue;

	return (
		<div className='space-y-2.5'>
			<div className='flex justify-between text-xs text-white/30'>
				<span>last rebalance: {lastRebalance}</span>
				<span>last report: {lastWeeklyReport}</span>
			</div>
			<div className='grid grid-cols-2 gap-2.5 md:grid-cols-4'>
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
				<div className='flex flex-col items-center justify-center gap-2 rounded-lg bg-white/5 p-4 text-center'>
					<p className='text-xs uppercase tracking-wider text-white/40'>regime</p>

					<RegimeBadge regime={summary.regime} />

					<p className='text-xs text-white/30'>
						{summary.regime === 'bullish' ? 'full exposure' : 'reduced exposure'}
					</p>
				</div>
			</div>

			<div className='grid grid-cols-2 gap-2.5 md:grid-cols-4'>
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
