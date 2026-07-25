import TradeTooltipContent from '@/features/trades/components/atoms/TradeTooltipContent';
import { computeTradeStats } from '@/features/trades/utils/trades-statistics';
import Card from '@/shared/components/atoms/Card';
import Tooltip from '@/shared/components/atoms/Tooltip';
import type { Trade } from '@/shared/types/trades';
import { usd } from '@/shared/utils/currency';

interface ITradeStatistics {
	data: Trade[];
}

function TradeStatistics({ data }: ITradeStatistics) {
	const stats = computeTradeStats(data);

	if (!stats) return null;

	const pfColor =
		stats.profitFactor > 1.5
			? 'text-green-400'
			: stats.profitFactor > 1
				? 'text-yellow-400'
				: 'text-red-400';

	return (
		<Card title='trade stats'>
			<div className='space-y-4 mt-1'>
				<div className='grid grid-cols-1 xs:grid-cols-3 gap-3'>
					<div className='rounded-lg bg-linear-to-br from-white/5 to-white/0 p-3'>
						<p className='text-xs text-white/40'>Win Rate</p>
						<p className='text-lg font-semibold'>{(stats.winRate * 100).toFixed(1)}%</p>
						<div className='mt-2 h-1 w-full bg-white/10 rounded'>
							<div
								className='h-1 bg-green-400 rounded'
								style={{ width: `${stats.winRate * 100}%` }}
							/>
						</div>
					</div>

					<div className='rounded-lg bg-linear-to-br from-white/5 to-white/0 p-3'>
						<p className='text-xs text-white/40'>Profit Factor</p>
						<p className={`text-lg font-semibold ${pfColor}`}>
							{stats.profitFactor === Infinity ? '∞' : stats.profitFactor.toFixed(2)}
						</p>
					</div>

					<div className='rounded-lg bg-linear-to-br from-white/5 to-white/0 p-3'>
						<p className='text-xs text-white/40'>Avg Hold</p>
						<p className='text-lg font-semibold'>{stats.avgDuration.toFixed(1)}d</p>
					</div>
				</div>

				<div className='grid grid-cols-1 xs:grid-cols-2 gap-3 text-sm'>
					<div className='flex justify-between text-white/60'>
						<span>Avg Win</span>
						<span className='text-green-400 font-medium'>{usd(stats.avgWin)}</span>
					</div>

					<div className='flex justify-between text-white/60'>
						<span>Avg Loss</span>
						<span className='text-red-400 font-medium'>{usd(stats.avgLoss)}</span>
					</div>

					<div className='flex justify-between text-white/60'>
						<span>Total Trades</span>
						<span className='font-medium'>{stats.totalTrades}</span>
					</div>
				</div>

				<div className='grid grid-cols-2 gap-3'>
					<div className='rounded-lg border border-green-500/10 bg-linear-to-br from-green-500/5 to-green-500/0 p-3'>
						<p className='text-xs text-green-400/70'>Best Trade</p>
						{stats.bestTradeDetails ? (
							<Tooltip content={<TradeTooltipContent trade={stats.bestTradeDetails} />}>
								<p className='text-sm font-semibold text-green-400'>{usd(stats.bestTrade)}</p>
							</Tooltip>
						) : (
							<p className='text-sm font-semibold text-green-400'>{usd(stats.bestTrade)}</p>
						)}
					</div>

					<div className='rounded-lg border border-red-500/10 bg-linear-to-br from-red-500/5 to-red-500/0 p-3'>
						<p className='text-xs text-red-400/70'>Worst Trade</p>
						{stats.worstTradeDetails ? (
							<Tooltip content={<TradeTooltipContent trade={stats.worstTradeDetails} />}>
								<p className='text-sm font-semibold text-red-400'>{usd(stats.worstTrade)}</p>
							</Tooltip>
						) : (
							<p className='text-sm font-semibold text-red-400'>{usd(stats.worstTrade)}</p>
						)}
					</div>
				</div>
			</div>
		</Card>
	);
}

export default TradeStatistics;
