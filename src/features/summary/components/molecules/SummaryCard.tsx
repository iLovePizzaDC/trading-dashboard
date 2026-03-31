import MetricItem from '@/features/summary/components/atoms/MetricItem';
import RegimeBadge from '@/features/summary/components/atoms/RegimeBadge';
import type { Summary } from '@/shared/types/summary';

interface ISummaryCard {
	data: Summary;
}

function SummaryCard({ data }: ISummaryCard) {
	const isPos = (n: number) => n >= 0;
	const pct = (n: number) => `${n >= 0 ? '+' : ''}${n.toFixed(2)}%`;
	const usd = (n: number) =>
		new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

	const spy4wDiff =
		data.rolling_4w !== null && data.spy_4w !== null ? data.rolling_4w - data.spy_4w : null;

	const startValue = data.portfolio_value / (1 + data.total_return / 100);
	const absReturn = data.portfolio_value - startValue;

	return (
		<div className='space-y-2.5'>
			<div className='grid grid-cols-2 gap-2.5 md:grid-cols-4'>
				<div className='col-span-2'>
					<MetricItem
						label='portfolio value'
						value={usd(data.portfolio_value)}
						sub={`${absReturn >= 0 ? '+' : ''}${usd(absReturn)} since start`}
						positive={isPos(absReturn)}
						featured
						large
					/>
				</div>
				<MetricItem
					label='total return'
					value={pct(data.total_return)}
					sub='since inception'
					positive={isPos(data.total_return)}
				/>
				<div className='flex flex-col items-center justify-center gap-2 rounded-lg bg-white/5 p-4 text-center'>
					<p className='text-xs uppercase tracking-wider text-white/40'>regime</p>

					<RegimeBadge regime={data.regime} />

					<p className='text-xs text-white/30'>
						{data.regime === 'bullish' ? 'full exposure' : 'reduced exposure'}
					</p>
				</div>
			</div>

			<div className='grid grid-cols-2 gap-2.5 md:grid-cols-4'>
				<MetricItem
					label='4-week return'
					value={data.rolling_4w !== null ? pct(data.rolling_4w) : 'n/a'}
					sub={data.spy_4w !== null ? `SPY ${pct(data.spy_4w)}` : undefined}
					positive={data.rolling_4w !== null ? isPos(data.rolling_4w) : undefined}
				/>
				<MetricItem
					label='vs SPY'
					value={spy4wDiff !== null ? pct(spy4wDiff) : 'n/a'}
					sub='4-week delta'
					positive={spy4wDiff !== null ? isPos(spy4wDiff) : undefined}
				/>
				<MetricItem
					label='max drawdown'
					value={pct(data.max_dd)}
					sub='since inception'
					positive={isPos(data.max_dd)}
				/>
				<MetricItem
					label='sharpe ratio'
					value={data.sharpe.toFixed(2)}
					sub='annualised'
					positive={isPos(data.sharpe)}
				/>
			</div>
		</div>
	);
}

export default SummaryCard;
