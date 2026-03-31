import EquityTooltip from '@/features/equity/components/atoms/EquityTooltip';
import type { EquityPoint } from '@/shared/types/equity';
import {
	Area,
	AreaChart,
	CartesianGrid,
	ReferenceLine,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';

interface IEquityChart {
	data: EquityPoint[];
}

export default function EquityChart({ data }: IEquityChart) {
	const startValue = data[0]?.equity ?? 0;
	const currentValue = data[data.length - 1]?.equity ?? 0;
	const isPos = currentValue >= startValue;

	const color = isPos ? '#4ade80' : '#f87171';

	const minVal = Math.min(...data.map((d) => d.equity));
	const maxVal = Math.max(...data.map((d) => d.equity));
	const padding = (maxVal - minVal) * 0.1;

	const tickInterval = Math.ceil(data.length / 6);

	return (
		<div className='rounded-xl border border-white/10 bg-white/5 p-4'>
			<div className='mb-4 flex items-baseline justify-between'>
				<p className='text-xs uppercase tracking-wider text-white/40'>equity curve</p>
				<p className={`text-sm font-medium ${isPos ? 'text-green-400' : 'text-red-400'}`}>
					{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
						currentValue,
					)}
				</p>
			</div>
			<ResponsiveContainer width='100%' height={200}>
				<AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
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
						tickFormatter={(val) => `$${val.toFixed(0)}`}
						width={52}
					/>
					<ReferenceLine y={startValue} stroke='rgba(255,255,255,0.15)' strokeDasharray='4 4' />
					<Tooltip content={<EquityTooltip />} />
					<Area
						type='monotone'
						dataKey='equity'
						stroke={color}
						strokeWidth={1.5}
						fill='url(#equityGradient)'
						dot={false}
						activeDot={{ r: 4, fill: color, strokeWidth: 0 }}
					/>
				</AreaChart>
			</ResponsiveContainer>
		</div>
	);
}
