import { getMomentumColor } from '@/features/decisions/utils/decision-history-row';
import type { Candidate, DecisionEntry } from '@/shared/types/decisions';

interface IDecisionHistoryRow {
	decision: DecisionEntry;
	cardHeight: number;
}

function DecisionHistoryRow({ decision, cardHeight }: IDecisionHistoryRow) {
	const top = [...decision.candidates]
		.sort((a, b) => (b.momentum ?? 0) - (a.momentum ?? 0))
		.slice(0, 3);

	const pct = (c: Candidate) => (c.momentum !== null ? (c.momentum * 100).toFixed(1) : null);

	return (
		<div
			className='rounded-lg border border-white/10 bg-linear-to-br from-white/5 to-transparent px-3 py-2 flex flex-col justify-between'
			style={{ height: cardHeight }}
		>
			<div className='flex items-center justify-between'>
				<p className='text-xs text-white/40 truncate'>{decision.date}</p>

				<div className='flex items-center gap-2 shrink-0'>
					<span className='text-[10px] text-white/30'>{decision.candidates.length} picks</span>
					<div className='h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse' />
				</div>
			</div>

			<div className='flex gap-2'>
				{top.map((c, i) => (
					<div
						key={c.symbol}
						className={`
							px-2 py-1 rounded-md text-xs border whitespace-nowrap shrink-0
							${getMomentumColor(c.momentum ?? undefined)}
							${i === 0 ? 'ring-1 ring-green-400/40 shadow-[0_0_8px_rgba(34,197,94,0.3)]' : ''}
						`}
					>
						<span className='font-medium'>{c.symbol}</span>
						{c.momentum !== undefined && <span className='ml-1 opacity-70'>{pct(c)}%</span>}
					</div>
				))}
			</div>

			<div className='h-3'>
				{decision.candidates.length > 3 && (
					<p className='text-[10px] text-white/30 truncate'>
						+{decision.candidates.length - 3} more
					</p>
				)}
			</div>
		</div>
	);
}

export default DecisionHistoryRow;
