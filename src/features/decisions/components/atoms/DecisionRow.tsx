import type { Candidate } from '@/shared/types/decisions';

interface IDecisionRow {
	candidate: Candidate;
	isLast?: boolean;
}

function DecisionRow({ candidate, isLast = false }: IDecisionRow) {
	const { symbol, momentum, passes_trend, selected, rejected_reason } = candidate;
	const pct = momentum !== null ? (momentum * 100).toFixed(1) : null;
	const barWidth = momentum !== null ? Math.min(momentum * 100, 100) : 0;

	const barColor = selected ? '#4ade80' : !passes_trend ? '#f87171' : 'rgba(255,255,255,0.15)';

	const reasonLabel: Record<string, string> = {
		not_in_top_ranked: 'not top',
		below_sma200: 'below sma200',
		below_threshold: 'low momentum',
		correlated: 'correlated',
		no_momentum: 'no data',
	};

	return (
		<div className={`flex items-center gap-3 py-2.5 ${isLast ? '' : 'border-b border-white/5'}`}>
			<p className='w-12 text-xs font-medium text-white'>{symbol}</p>
			<div className='flex-1 overflow-hidden rounded-full bg-white/5' style={{ height: 4 }}>
				<div
					className='h-full rounded-full transition-all'
					style={{ width: `${barWidth}%`, background: barColor }}
				/>
			</div>
			<p className='w-10 text-right text-xs text-white/40'>{pct ?? '—'}%</p>
			<p className='w-24 text-right text-xs'>
				{selected ? (
					<span className='text-green-400'>selected</span>
				) : (
					<span className='text-white/30'>
						{rejected_reason ? (reasonLabel[rejected_reason] ?? rejected_reason) : '—'}
					</span>
				)}
			</p>
		</div>
	);
}

export default DecisionRow;
