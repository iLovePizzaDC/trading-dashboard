import MomentumTooltip from '@/features/momentum/components/atoms/MomentumTooltip';
import { calcMomentumTimeline } from '@/features/momentum/components/utils/momentum';
import Card from '@/shared/components/atoms/Card';
import DateRangeFilter from '@/shared/components/atoms/DateRangeFilter';
import { useDateRangeFilter } from '@/shared/hooks/useDateRangeFilter';
import type { DecisionEntry } from '@/shared/types/decisions';
import { useCallback, useMemo } from 'react';
import {
	CartesianGrid,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';

interface IMomentumTimeline {
	data: DecisionEntry[];
}

function MomentumTimeline({ data }: IMomentumTimeline) {
	const getDate = useCallback((d: DecisionEntry) => d.date, []);
	const { range, setRange, filteredData } = useDateRangeFilter('momentum-timeline', data, getDate);

	const timeline = useMemo(() => calcMomentumTimeline(filteredData), [filteredData]);

	return (
		<Card
			title='momentum timeline'
			badge={
				<div className='flex items-center gap-4 text-[10px] text-white/30'>
					<span className='flex items-center gap-1'>
						<span className='inline-block h-px w-4 bg-purple-400' /> avg
					</span>
					<span className='flex items-center gap-1'>
						<span className='inline-block h-px w-4 bg-white/20' /> top
					</span>
				</div>
			}
		>
			<div className='mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
				<DateRangeFilter range={range} setRange={setRange} />
			</div>
			{timeline.length < 2 ? (
				<p className='py-6 text-center text-xs text-white/30'>Not enough rebalance data yet.</p>
			) : (
				<div className='h-48'>
					<ResponsiveContainer width='100%' height='100%'>
						<LineChart data={timeline} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
							<CartesianGrid
								strokeDasharray='3 3'
								stroke='rgba(255,255,255,0.05)'
								vertical={false}
							/>
							<XAxis
								dataKey='date'
								tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }}
								tickLine={false}
								axisLine={false}
								tickFormatter={(v) => v.slice(5)}
							/>
							<YAxis
								tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }}
								tickLine={false}
								axisLine={false}
								tickFormatter={(v) => `${v}%`}
								width={36}
							/>
							<Tooltip content={<MomentumTooltip />} />
							<Line
								type='monotone'
								dataKey='avgMomentum'
								name='avg'
								stroke='#c084fc'
								strokeWidth={1.5}
								dot={{ r: 3, fill: '#c084fc', strokeWidth: 0 }}
								activeDot={{ r: 4, fill: '#c084fc', strokeWidth: 0 }}
							/>
							<Line
								type='monotone'
								dataKey='topMomentum'
								name='top'
								stroke='rgba(255,255,255,0.4)'
								strokeWidth={1}
								strokeDasharray='4 4'
								dot={false}
								activeDot={false}
								isAnimationActive={false}
							/>
						</LineChart>
					</ResponsiveContainer>
				</div>
			)}
		</Card>
	);
}

export default MomentumTimeline;
