import MomentumTooltip from '@/features/momentum/components/atoms/MomentumTooltip';
import { calcMomentumTimeline } from '@/features/momentum/components/utils/momentum';
import Card from '@/shared/components/atoms/Card';
import DateRangeFilter from '@/shared/components/atoms/DateRangeFilter';
import { RANGES, type Range } from '@/shared/constants/date-range';
import { useFilterWithStorage } from '@/shared/hooks/useFilterWithStorage';
import type { DecisionEntry } from '@/shared/types/decisions';
import { cutoffDate } from '@/shared/utils/date-range';
import { DateTime } from 'luxon';
import { useMemo } from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip } from 'recharts';

const EXCLUDED_RANGES: Range[] = ['1W', '1M'];

interface IMomentumTimeline {
	data: DecisionEntry[];
}

function MomentumTimeline({ data }: IMomentumTimeline) {
	const {
		value: range,
		setValue: setRange,
		filteredData,
	} = useFilterWithStorage<DecisionEntry, Range>({
		storageKey: 'momentum-timeline',
		data,
		defaultValue: '6M',
		allValues: RANGES,
		excludedValues: EXCLUDED_RANGES,
		filterFn: (decision, range) => {
			const cutoff = cutoffDate(range);
			if (!cutoff) return true;

			const dt = DateTime.fromISO(decision.date).startOf('day');
			return dt >= cutoff.startOf('day');
		},
	});

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
				<DateRangeFilter range={range} setRange={setRange} excludedRanges={EXCLUDED_RANGES} />
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
