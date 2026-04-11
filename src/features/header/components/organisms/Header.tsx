import DownloadDropdown from '@/features/header/components/molecules/DownloadDropdown';
import { useLastUpdated } from '@/features/header/hooks/useLastUpdated';
import { fetchLastRebalanceDate } from '@/shared/api/data';
import { useFetch } from '@/shared/hooks/useFetch';
import { ArrowRightIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

function Header() {
	const {
		data: lastRebalance,
		loading: rebalanceLoading,
		error: rebalanceError,
	} = useFetch(fetchLastRebalanceDate);
	const lastUpdated = useLastUpdated();
	const [expanded, setExpanded] = useState(false);

	const nextRebalance = lastRebalance
		? new Date(new Date(lastRebalance.trim()).getTime() + 30 * 24 * 60 * 60 * 1000)
				.toISOString()
				.split('T')[0]
		: null;

	return (
		<div className='flex flex-col gap-3 md:flex-row md:items-start md:justify-between'>
			<div className='flex flex-col gap-1'>
				<button
					onClick={() => setExpanded((v) => !v)}
					className='transition-opacity hover:opacity-80 cursor-pointer'
				>
					<div className='flex items-center gap-1.5'>
						<div className='flex items-start gap-1.5'>
							<span className='w-1.5 h-1.5 mt-[0.4rem] bg-green-400 rounded-full animate-pulse' />
							<p className='text-lg uppercase tracking-widest text-white/30'>luna — trading bot</p>
						</div>
						<ChevronDownIcon
							className={`w-3 h-3 text-white/15 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
						/>
					</div>
				</button>

				<div
					className={`flex flex-col gap-0.5 overflow-hidden transition-all duration-300 ease-in-out ${
						expanded ? 'max-h-10 opacity-100' : 'max-h-0 opacity-0'
					}`}
				>
					<div className='flex items-center gap-3 text-xs text-white/20 tracking-wider'>
						{lastUpdated && <span>updated {lastUpdated}</span>}
					</div>

					<div className='flex items-center gap-1.5 text-xs text-white/20 tracking-wider'>
						{rebalanceLoading && <span className='w-48 h-3 rounded bg-white/10 animate-pulse' />}
						{rebalanceError && <span className='text-red-400/40'>rebalance unavailable</span>}
						{lastRebalance && (
							<>
								<span>rebalance {lastRebalance.trim()}</span>
								<ArrowRightIcon className='w-3 h-3 shrink-0' />
								<span>{nextRebalance}</span>
							</>
						)}
					</div>
				</div>
			</div>

			<div className='self-end md:self-auto'>
				<DownloadDropdown />
			</div>
		</div>
	);
}

export default Header;
