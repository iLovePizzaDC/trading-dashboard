import EquityTooltip from '@/features/equity/components/atoms/EquityTooltip';
import type { EquityPoint } from '@/shared/types/equity';
import { useMemo, useState } from 'react';

import { RANGES, type Range } from '@/features/equity/constants/equity';
import { cutoffDate } from '@/features/equity/utils/performance';
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

interface IEquityCurve {
	data: (EquityPoint & { spy?: number | null })[];
}

function EquityCurve({ data }: IEquityCurve) {
	const [showSpy, setShowSpy] = useState(true);
	const [relative, setRelative] = useState(true);
	const [range, setRange] = useState<Range>('3M');

	const filteredData = useMemo(() => {
		const cutoff = cutoffDate(range);
		if (!cutoff) return data;
		return data.filter((d) => new Date(d.date) >= cutoff);
	}, [data, range]);

	const chartData = useMemo(() => {
		if (!filteredData.length) return [];

		const botStart = data[0].equity;
		const spyStart = data.find((d) => d.spy)?.spy ?? null;

		return filteredData.map((d) => ({
			date: d.date,
			equity: relative ? (d.equity / botStart) * 100 : d.equity,
			spy: relative && d.spy && spyStart ? (d.spy / spyStart) * 100 : (d.spy ?? null),
		}));
	}, [filteredData, relative]);

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
		<div className='rounded-xl border border-white/10 bg-linear-to-br from-white/5 to-white/0 p-4'>
			<div className='mb-4 flex items-baseline justify-between'>
				<p className='text-xs uppercase tracking-wider text-white/40'>equity curve</p>

				<p className={`text-sm font-medium ${isPos ? 'text-green-400' : 'text-red-400'}`}>
					{relative
						? `${(currentValue - 100).toFixed(2)}%`
						: new Intl.NumberFormat('en-US', {
								style: 'currency',
								currency: 'USD',
							}).format(currentValue)}
				</p>
			</div>

			<div className='mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
				<div className='flex gap-1 overflow-x-auto scrollbar-none'>
					{RANGES.map((r) => (
						<button
							key={r}
							onClick={() => setRange(r)}
							className={`shrink-0 rounded px-2 py-0.5 text-xs font-medium transition cursor-pointer ${
								range === r ? 'bg-white/15 text-white' : 'text-white/35 hover:text-white/60'
							} transition-all duration-300 cursor-pointer`}
						>
							{r}
						</button>
					))}
				</div>

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

			<ResponsiveContainer width='100%' height={200}>
				<AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
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

					<Tooltip
						content={<EquityTooltip positive={isPos} showSpy={showSpy} relative={relative} />}
					/>

					<Area
						type='monotone'
						dataKey='equity'
						stroke={color}
						strokeWidth={1.5}
						fill='url(#equityGradient)'
						dot={false}
						activeDot={{ r: 4, fill: color, strokeWidth: 0 }}
					/>

					{showSpy && (
						<Line
							type='monotone'
							dataKey='spy'
							stroke='rgba(255,255,255,0.5)'
							strokeWidth={1.2}
							dot={false}
							strokeDasharray='5 5'
						/>
					)}
				</AreaChart>
			</ResponsiveContainer>
		</div>
	);
}

export default EquityCurve;
