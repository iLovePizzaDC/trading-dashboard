import type { StopHistoryEntry } from '@/shared/types/stops';

interface IStopHistoryRow {
	symbol: string;
	entry: StopHistoryEntry;
	isLast?: boolean;
}

function StopHistoryRow({ symbol, entry, isLast = false }: IStopHistoryRow) {
	const usd = (n: number) =>
		new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

	const isRaise = entry.new_stop > entry.old_stop;
	const isFirst = entry.old_stop === 0;

	return (
		<div
			className={`h-full flex items-center justify-between ${
				isLast ? '' : 'border-b border-white/5'
			}`}
		>
			<div className='flex items-center gap-3 min-w-0'>
				<p className='w-12 text-xs font-medium text-white truncate'>{symbol}</p>
				<p className='text-xs text-white/40 truncate'>{entry.date}</p>
			</div>

			<div className='flex items-center gap-2 text-right min-w-0'>
				{!isFirst && (
					<>
						<p className='text-xs text-white/30 truncate'>{usd(entry.old_stop)}</p>
						<p className='text-xs text-white/20'>→</p>
					</>
				)}

				<p
					className={`text-sm font-medium truncate ${
						isFirst ? 'text-white/70' : isRaise ? 'text-green-400' : 'text-red-400'
					}`}
				>
					{usd(entry.new_stop)}
				</p>

				{!isFirst && (
					<p className={`text-xs ${isRaise ? 'text-green-400/60' : 'text-red-400/60'}`}>
						{isRaise ? '↑' : '↓'}
					</p>
				)}
			</div>
		</div>
	);
}

export default StopHistoryRow;
