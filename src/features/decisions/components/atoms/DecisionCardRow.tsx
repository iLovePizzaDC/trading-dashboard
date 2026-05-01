import type { Candidate } from '@/shared/types/decisions';

interface IDecisionCardRow {
	candidate: Candidate;
	isLast?: boolean;
}

function DecisionCardRow({ candidate, isLast = false }: IDecisionCardRow) {
	const { symbol, momentum, passes_trend, selected, rejected_reason } = candidate;
	const pctLabel =
		momentum !== null ? (momentum * 100 > 100 ? '>100' : (momentum * 100).toFixed(1)) : null;
	const barWidth = momentum !== null ? Math.min(momentum * 100, 100) : 0;

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
			<div className='flex-1 overflow-hidden rounded-full bg-linear-to-br from-white/5 to-white/0 h-1'>
				<div
					className={`h-full rounded-full transition-all ${
						selected ? 'bg-green-400' : !passes_trend ? 'bg-red-400' : 'bg-white/15'
					}`}
					style={{ width: `${barWidth}%` }}
				/>
			</div>
			<p
				className='w-10 text-right text-xs text-white/40'
				title={momentum?.toString() ?? undefined}
			>
				{pctLabel ?? '—'}%
			</p>
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

export default DecisionCardRow;
