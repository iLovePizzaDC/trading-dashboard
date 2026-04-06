import type { StopHistoryEntry } from '@/shared/types/stops';
import { usd } from '@/shared/utils/currency';
import { ArrowDownIcon, ArrowRightIcon, ArrowUpIcon } from '@heroicons/react/24/outline';

interface IStopHistoryRow {
	symbol: string;
	entry: StopHistoryEntry;
	isLast?: boolean;
	isLatestRun?: boolean;
}

function StopHistoryRow({ symbol, entry, isLast = false, isLatestRun = false }: IStopHistoryRow) {
	const isRaise = entry.new_stop > entry.old_stop;
	const isFirst = entry.old_stop === 0;

	return (
		<div
			className={`h-full pr-2 flex items-center justify-between rounded
				${isLatestRun ? 'border border-white/10 bg-linear-to-br from-white/5 to-transparent' : ''}
				${isLast ? '' : 'border-b border-white/5'}
			`}
		>
			<div className='flex items-center gap-3 min-w-0'>
				<p className='w-12 text-xs font-medium text-white truncate'>{symbol}</p>
				<p className='text-xs text-white/40 truncate'>{entry.date}</p>
			</div>

			<div className='flex items-center gap-2 text-right min-w-0'>
				{!isFirst && (
					<>
						<p className='text-xs text-white/30 truncate'>{usd(entry.old_stop)}</p>
						<p className='text-white/20'>
							<ArrowRightIcon className='h-3 w-3' />
						</p>
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
					<p className={`${isRaise ? 'text-green-400/60' : 'text-red-400/60'}`}>
						{isRaise ? <ArrowUpIcon className='h-3 w-3' /> : <ArrowDownIcon className='h-3 w-3' />}
					</p>
				)}
			</div>
		</div>
	);
}

export default StopHistoryRow;
