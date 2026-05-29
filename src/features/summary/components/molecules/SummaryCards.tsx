import MetricItem from '@/features/summary/components/atoms/MetricItem';
import { fadeReducer } from '@/features/summary/components/molecules/SummaryCards.reducer';
import SummaryCardsShell from '@/features/summary/components/molecules/SummaryCardsShell';
import { type TabType } from '@/features/summary/types/tab';
import { useLocalStorage } from '@/shared/hooks/useLocalStorage';
import type { Summary } from '@/shared/types/summary';
import { fmt, isPos, usd } from '@/shared/utils/currency';
import { useEffect, useReducer, useRef, useState } from 'react';

interface ISummaryCards {
	summary: Summary;
}

function SummaryCards({ summary }: ISummaryCards) {
	// TODO outsource into hooks
	const [activeTab, setActiveTab] = useLocalStorage<TabType>('summary-active-tab', 'overview');
	const [{ displayedTab, isFading }, dispatch] = useReducer(fadeReducer, {
		displayedTab: 'overview',
		isFading: false,
	});
	const [height, setHeight] = useState<number | 'auto'>('auto');
	const contentRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (activeTab === displayedTab) return;
		const fadeOut = setTimeout(() => dispatch({ type: 'start_fade' }), 0);
		const fadeIn = setTimeout(() => dispatch({ type: 'finish_fade', tab: activeTab }), 150);
		return () => {
			clearTimeout(fadeOut);
			clearTimeout(fadeIn);
		};
	}, [activeTab, displayedTab]);

	useEffect(() => {
		if (!contentRef.current) return;

		const element = contentRef.current;

		const updateHeight = () => {
			setHeight(element.scrollHeight);
		};

		updateHeight();

		const observer = new ResizeObserver(() => {
			updateHeight();
		});

		observer.observe(element);

		return () => observer.disconnect();
	}, [displayedTab]);

	const handleTabChange = (tab: TabType) => {
		if (tab !== activeTab) {
			setActiveTab(tab);
		}
	};

	const spy4wDiff =
		summary.rolling_4w !== null && summary.spy_4w !== null
			? summary.rolling_4w - summary.spy_4w
			: null;

	const roiPercent =
		summary.total_invested > 0 ? (summary.profit / summary.total_invested) * 100 : 0;

	return (
		<SummaryCardsShell activeTab={activeTab} handleTabChange={handleTabChange}>
			<div
				className='transition-all duration-300 overflow-hidden'
				style={{ height: typeof height === 'number' ? `${height}px` : 'auto' }}
			>
				<div
					ref={contentRef}
					className={`space-y-4 transition-opacity duration-300 ${
						isFading ? 'opacity-0' : 'opacity-100'
					}`}
				>
					{displayedTab === 'overview' && (
						<div className='grid grid-cols-2 gap-4 md:grid-cols-3'>
							<MetricItem
								label='total return'
								value={fmt(summary.total_return)}
								sub='since inception'
								positive={isPos(summary.total_return)}
							/>

							<MetricItem
								label='CAGR'
								value={fmt(summary.cagr)}
								sub='annualised'
								positive={isPos(summary.cagr)}
							/>

							<MetricItem
								label='max drawdown'
								value={fmt(summary.max_dd)}
								sub='worst peak-to-trough'
								positive={isPos(summary.max_dd)}
							/>

							<MetricItem
								label='sharpe ratio'
								value={summary.sharpe.toFixed(2)}
								sub='risk-adjusted return'
								positive={isPos(summary.sharpe)}
							/>

							<MetricItem
								label='4-week return'
								value={summary.rolling_4w !== null ? fmt(summary.rolling_4w) : 'n/a'}
								sub='recent momentum'
								positive={summary.rolling_4w !== null ? isPos(summary.rolling_4w) : undefined}
							/>

							<MetricItem
								label='vs SPY'
								value={spy4wDiff !== null ? fmt(spy4wDiff) : 'n/a'}
								sub='4-week delta'
								positive={spy4wDiff !== null ? isPos(spy4wDiff) : undefined}
							/>
						</div>
					)}

					{displayedTab === 'capital' && (
						<div className='grid grid-cols-2 gap-4 md:grid-cols-2'>
							<MetricItem
								label='total invested'
								value={summary.total_invested ? usd(summary.total_invested) : usd(0)}
								sub='all deposits'
								positive={true}
							/>

							<MetricItem
								label='current value'
								value={usd(summary.portfolio_value)}
								sub='total portfolio'
								positive={isPos(summary.portfolio_value)}
							/>

							<MetricItem
								label='pure profit'
								value={summary.profit ? usd(summary.profit) : usd(0)}
								sub='value - deposits'
								positive={isPos(summary.profit)}
							/>

							<MetricItem
								label='ROI'
								value={fmt(roiPercent)}
								sub='profit / invested'
								positive={isPos(roiPercent)}
							/>
						</div>
					)}

					{displayedTab === 'performance' && (
						<div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
							<div className='rounded-xl border border-white/10 bg-linear-to-br from-white/5 to-white/0 p-4'>
								<h3 className='mb-3 text-sm font-semibold text-white/80'>Weekly Performance</h3>
								<div className='space-y-3'>
									<MetricItem
										label='4-week return'
										value={summary.rolling_4w !== null ? fmt(summary.rolling_4w) : 'n/a'}
										positive={summary.rolling_4w !== null ? isPos(summary.rolling_4w) : undefined}
									/>
									<MetricItem
										label='SPY return'
										value={summary.spy_4w !== null ? fmt(summary.spy_4w) : 'n/a'}
										positive={summary.spy_4w !== null ? isPos(summary.spy_4w) : undefined}
									/>
								</div>
							</div>

							<div className='rounded-xl border border-white/10 bg-linear-to-br from-white/5 to-white/0 p-4'>
								<h3 className='mb-3 text-sm font-semibold text-white/80'>Risk Metrics</h3>
								<div className='space-y-3'>
									<MetricItem
										label='max drawdown'
										value={fmt(summary.max_dd)}
										positive={isPos(summary.max_dd)}
									/>
									<MetricItem
										label='sharpe ratio'
										value={summary.sharpe.toFixed(2)}
										positive={isPos(summary.sharpe)}
									/>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</SummaryCardsShell>
	);
}

export default SummaryCards;
