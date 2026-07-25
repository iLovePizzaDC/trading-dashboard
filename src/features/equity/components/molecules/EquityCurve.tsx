import EquityTooltip from '@/features/equity/components/atoms/EquityTooltip';
import type { EquityPoint } from '@/shared/types/equity';

import DepositLabel from '@/features/equity/components/atoms/DepositLabel';
import { useEquityChartData } from '@/features/equity/hooks/useEquityChartData';
import { useEquitySettings } from '@/features/equity/hooks/useEquitySettings';
import Card from '@/shared/components/atoms/Card';
import DateRangeFilter from '@/shared/components/atoms/DateRangeFilter';
import type { DecisionEntry } from '@/shared/types/decisions';
import type { Deposit } from '@/shared/types/deposits';
import { usd } from '@/shared/utils/currency';
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
	data: EquityPoint[];
	deposits: Deposit[];
	decisions: DecisionEntry[];
}

function EquityCurve({ data, deposits, decisions }: IEquityCurve) {
	const {
		showSpy,
		setShowSpy,
		relative,
		setRelative,
		curveMode,
		setCurveMode,
		hoveredValue,
		setHoveredValue,
		range,
		setRange,
	} = useEquitySettings(data);
	const { chartData, rebalanceIndexes } = useEquityChartData(
		data,
		decisions,
		relative,
		curveMode,
		range,
	);

	const unfilteredStartValue = data[0]?.equity ?? 0;
	const filteredStartValue = chartData[0]?.equity ?? 0;
	const currentValue = chartData[chartData.length - 1]?.equity ?? 0;

	const displayValue = hoveredValue ?? currentValue;
	const isPos = currentValue >= filteredStartValue;
	const color = isPos ? '#4ade80' : '#f87171';

	return (
		<Card
			title='equity curve'
			badge={
				<button
					onClick={() => setRelative((prev) => !prev)}
					className={`text-sm font-medium ${isPos ? 'text-green-400' : 'text-red-400'} cursor-pointer transition-all`}
				>
					{relative ? `${(displayValue - 100).toFixed(2)}%` : usd(displayValue)}
				</button>
			}
		>
			<div className='mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
				<DateRangeFilter range={range} setRange={setRange} />

				<div className='flex items-center justify-between gap-4 text-xs sm:justify-end'>
					<span className='flex items-center gap-1 text-white/60'>
						<span
							className={`h-2 w-2 rounded-full ${isPos ? 'bg-green-400' : 'bg-red-400'}`}
							data-testid='bot-indicator'
						/>
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
						onClick={() => setCurveMode((prev) => (prev === 'zoom' ? 'period' : 'zoom'))}
						className='text-white/40 hover:text-white/70 transition cursor-pointer'
						title={
							curveMode === 'zoom'
								? 'Zoom Mode: Filter by date range'
								: 'Period Mode: Show period performance'
						}
					>
						{curveMode === 'zoom' ? '🔍' : '📊'}
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

					<XAxis dataKey='date' hide />

					<YAxis tick={false} axisLine={false} width={0} domain={['dataMin', 'dataMax']} />

					<ReferenceLine
						y={relative ? 100 : unfilteredStartValue}
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
								startValue={unfilteredStartValue}
								onHover={setHoveredValue}
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
