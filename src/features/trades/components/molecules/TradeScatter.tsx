import { RANGES, type Range } from '@/features/equity/constants/equity';
import { cutoffDate } from '@/features/equity/utils/performance';
import ScatterTooltip from '@/features/trades/components/atoms/ScatterTooltip';
import { buildScatterData } from '@/features/trades/utils/scatter';
import type { Trade } from '@/shared/types/trades';
import { useMemo, useState } from 'react';
import {
	CartesianGrid,
	ReferenceLine,
	ResponsiveContainer,
	Scatter,
	ScatterChart,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';

interface ITradeScatter {
	data: Trade[];
}

function TradeScatter({ data }: ITradeScatter) {
	const [range, setRange] = useState<Range>('3M');

	const filteredData = useMemo(() => {
		const cutoff = cutoffDate(range);
		if (!cutoff) return data;
		return data.filter((t) => new Date(t.date) >= cutoff);
	}, [data, range]);

	const points = buildScatterData(filteredData);
	const wins = points.filter((p) => p.pnl >= 0);
	const losses = points.filter((p) => p.pnl < 0);

	const allPrices = points.flatMap((p) => [p.entryPrice, p.exitPrice]);
	const minPrice = Math.min(...allPrices) * 0.98;
	const maxPrice = Math.max(...allPrices) * 1.02;

	return (
		<div className='rounded-xl border border-white/10 bg-linear-to-br from-white/5 to-white/0 p-4'>
			<div className='mb-3 flex items-center justify-between'>
				<p className='text-xs uppercase tracking-wider text-white/40'>entry / exit analysis</p>
				<div className='flex items-center gap-3 text-[10px] text-white/30'>
					<span className='flex items-center gap-1'>
						<span className='inline-block h-2 w-2 rounded-full bg-green-400/60' /> win (
						{wins.length})
					</span>
					<span className='flex items-center gap-1'>
						<span className='inline-block h-2 w-2 rounded-full bg-red-400/60' /> loss (
						{losses.length})
					</span>
				</div>
			</div>

			<div className='mb-3 flex gap-1 overflow-x-auto scrollbar-none'>
				{RANGES.map((r) => (
					<button
						key={r}
						onClick={() => setRange(r)}
						className={`shrink-0 rounded px-2 py-0.5 text-xs font-medium transition-all duration-300 cursor-pointer ${
							range === r ? 'bg-white/15 text-white' : 'text-white/35 hover:text-white/60'
						}`}
					>
						{r}
					</button>
				))}
			</div>

			{points.length === 0 ? (
				<p className='py-6 text-center text-xs text-white/30'>No closed trades in this period.</p>
			) : (
				<>
					<div className='h-48'>
						<ResponsiveContainer width='100%' height='100%'>
							<ScatterChart margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
								<CartesianGrid strokeDasharray='3 3' stroke='rgba(255,255,255,0.05)' />
								<XAxis
									dataKey='entryPrice'
									name='entry'
									type='number'
									domain={[minPrice, maxPrice]}
									tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }}
									tickLine={false}
									axisLine={false}
									tickFormatter={(v) => `$${v.toFixed(0)}`}
									label={{
										value: 'entry',
										position: 'insideBottomRight',
										fill: 'rgba(255,255,255,0.2)',
										fontSize: 10,
									}}
								/>
								<YAxis
									dataKey='exitPrice'
									name='exit'
									type='number'
									domain={[minPrice, maxPrice]}
									tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }}
									tickLine={false}
									axisLine={false}
									tickFormatter={(v) => `$${v.toFixed(0)}`}
									width={48}
									label={{
										value: 'exit',
										angle: -90,
										position: 'insideLeft',
										fill: 'rgba(255,255,255,0.2)',
										fontSize: 10,
									}}
								/>
								<ReferenceLine
									segment={[
										{ x: minPrice, y: minPrice },
										{ x: maxPrice, y: maxPrice },
									]}
									stroke='rgba(255,255,255,0.1)'
									strokeDasharray='4 4'
								/>
								<Tooltip
									content={<ScatterTooltip />}
									cursor={{
										stroke: 'rgba(255,255,255,0.15)',
										strokeWidth: 1,
										strokeDasharray: '4 4',
									}}
								/>
								<Scatter data={wins} fill='rgba(74,222,128,0.6)' />
								<Scatter data={losses} fill='rgba(248,113,113,0.6)' />
							</ScatterChart>
						</ResponsiveContainer>
					</div>
					<p className='mt-2 text-[10px] text-white/20'>
						Points above the diagonal line = profitable exit
					</p>
				</>
			)}
		</div>
	);
}

export default TradeScatter;
