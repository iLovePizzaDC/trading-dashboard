import EquityTooltip from '@/features/equity/components/atoms/EquityTooltip';
import type { EquityPoint } from '@/shared/types/equity';
import { useMemo } from 'react';

import Card from '@/shared/components/atoms/Card';
import DateRangeFilter from '@/shared/components/atoms/DateRangeFilter';
import { REBALANCE_DAYS } from '@/shared/constants/bot';
import { RANGES, type Range } from '@/shared/constants/date-range';
import { useFilterWithStorage } from '@/shared/hooks/useFilterWithStorage';
import { useLocalStorage } from '@/shared/hooks/useLocalStorage';
import type { Deposit } from '@/shared/types/deposits';
import { usd } from '@/shared/utils/currency';
import { cutoffDate } from '@/shared/utils/date-range';
import { DateTime } from 'luxon';
import {
	Area,
	AreaChart,
	CartesianGrid,
	Line,
	ReferenceLine,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';
import DepositLabel from '../atoms/DepositLabel';

interface IEquityCurve {
	data: EquityPoint[];
	deposits: Deposit[];
}

function EquityCurve({ data, deposits }: IEquityCurve) {
	const [showSpy, setShowSpy] = useLocalStorage<boolean>('equity-curve-spy', true);
	const [relative, setRelative] = useLocalStorage<boolean>('equity-curve-relative', true);

	const { value: range, setValue: setRange } = useFilterWithStorage<EquityPoint, Range>({
		storageKey: 'equity-curve-range',
		data,
		defaultValue: '3M',
		allValues: RANGES,
		filterFn: (d, range) => {
			const cutoff = cutoffDate(range);
			if (!cutoff) return true;
			return DateTime.fromISO(d.date).startOf('day') >= cutoff.startOf('day');
		},
	});

	const allChartData = useMemo(() => {
		if (!data.length) return [];

		const botStart = data[0].equity;
		const spyStart = data.find((d) => d.spy != null)?.spy ?? null;

		return data.map((d) => ({
			date: d.date,
			equity: relative ? (d.equity / botStart) * 100 : d.equity,
			spy:
				relative && d.spy != null && spyStart != null ? (d.spy / spyStart) * 100 : (d.spy ?? null),
		}));
	}, [data, relative]);

	const chartData = useMemo(() => {
		const cutoff = cutoffDate(range);
		if (!cutoff) return allChartData;
		return allChartData.filter(
			(d) => DateTime.fromISO(d.date).startOf('day') >= cutoff.startOf('day'),
		);
	}, [allChartData, range]);

	const rebalanceIndexes = useMemo(() => {
		if (!chartData.length) return [];

		const result: number[] = [];
		for (let i = 0; i < chartData.length; i += REBALANCE_DAYS) {
			result.push(i);
		}
		return result;
	}, [chartData]);

	const startValue = chartData[0]?.equity ?? 0;
	const currentValue = chartData[chartData.length - 1]?.equity ?? 0;
	const isPos = currentValue >= startValue;
	const color = isPos ? '#4ade80' : '#f87171';

	const allVals = chartData.flatMap((d) =>
		showSpy && d.spy != null ? [d.equity, d.spy] : [d.equity],
	);
	const minVal = Math.min(...allVals);
	const maxVal = Math.max(...allVals);
	const padding = (maxVal - minVal) * 0.1 || 1;

	const tickInterval = Math.ceil(chartData.length / 6);

	return (
		<Card
			title='equity curve'
			badge={
				<button
					onClick={() => setRelative((prev) => !prev)}
					className={`text-sm font-medium ${isPos ? 'text-green-400' : 'text-red-400'} cursor-pointer`}
				>
					{relative ? `${(currentValue - 100).toFixed(2)}%` : usd(currentValue)}
				</button>
			}
		>
			<div className='mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
				<DateRangeFilter range={range} setRange={setRange} />

				<div className='flex items-center justify-between gap-4 text-xs sm:justify-end'>
					<span className='flex items-center gap-1 text-white/60'>
						<span className={`h-2 w-2 rounded-full ${isPos ? 'bg-green-400' : 'bg-red-400'}`} />
						Bot
					</span>

					<button
						onClick={() => setShowSpy((prev) => !prev)}
						className={`flex items-center gap-1 transition cursor-pointer ${
							showSpy ? 'text-white/60' : 'text-white/25'
						}`}
					>
						<span
							className={`h-2 w-2 rounded-full border ${
								showSpy ? 'border-white/50 bg-transparent' : 'border-white/20 bg-transparent'
							}`}
							style={
								showSpy
									? {
											background:
												'repeating-linear-gradient(90deg,rgba(255,255,255,.5) 0px,rgba(255,255,255,.5) 3px,transparent 3px,transparent 6px)',
										}
									: {}
							}
						/>
						SPY
					</button>

					<button
						onClick={() => setRelative((prev) => !prev)}
						className='text-white/40 hover:text-white/70 transition cursor-pointer'
					>
						{relative ? '% return' : '$ value'}
					</button>
				</div>
			</div>

			<ResponsiveContainer width='100%' height={240}>
				<AreaChart data={chartData} margin={{ top: 10, right: 4, left: 0, bottom: 0 }}>
					<defs>
						<linearGradient id='equityGradient' x1='0' y1='0' x2='0' y2='1'>
							<stop offset='5%' stopColor={color} stopOpacity={0.15} />
							<stop offset='95%' stopColor={color} stopOpacity={0} />
						</linearGradient>
					</defs>

					<CartesianGrid strokeDasharray='3 3' stroke='rgba(255,255,255,0.05)' vertical={false} />

					<XAxis
						dataKey='date'
						tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }}
						tickLine={false}
						axisLine={false}
						interval={tickInterval}
						tickFormatter={(val) => val.slice(5)}
					/>

					<YAxis
						tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }}
						tickLine={false}
						axisLine={false}
						domain={[minVal - padding, maxVal + padding]}
						tickFormatter={(val) => (relative ? `${val.toFixed(0)}` : `$${val.toFixed(0)}`)}
						width={52}
					/>

					<ReferenceLine
						y={relative ? 100 : startValue}
						stroke='rgba(255,255,255,0.15)'
						strokeDasharray='4 4'
					/>

					{rebalanceIndexes.map((i) => (
						<ReferenceLine
							key={i}
							x={chartData[i]?.date}
							stroke='rgba(255,255,255,0.1)'
							strokeDasharray='2 4'
							strokeWidth={1}
						/>
					))}

					{deposits.map((d) => (
						<ReferenceLine
							key={d.date}
							x={d.date}
							stroke='rgba(168,85,247,0.4)'
							strokeDasharray='3 3'
							label={<DepositLabel value={`+${usd(d.amount)}`} />}
						/>
					))}

					<Tooltip
						content={
							<EquityTooltip
								positive={isPos}
								showSpy={showSpy}
								relative={relative}
								startValue={startValue}
							/>
						}
					/>

					<Area
						type='monotone'
						dataKey='equity'
						stroke={color}
						strokeWidth={1.5}
						fill='url(#equityGradient)'
						dot={false}
						activeDot={{
							r: 5,
							fill: color,
							strokeWidth: 2,
							stroke: 'rgba(255,255,255,0.3)',
							filter: `drop-shadow(0 0 8px ${color}66)`,
						}}
					/>

					{showSpy && (
						<Line
							type='monotone'
							dataKey='spy'
							stroke='rgba(255,255,255,0.5)'
							strokeWidth={1.2}
							dot={false}
							strokeDasharray='5 5'
							isAnimationActive={false}
						/>
					)}
				</AreaChart>
			</ResponsiveContainer>
		</Card>
	);
}

export default EquityCurve;
