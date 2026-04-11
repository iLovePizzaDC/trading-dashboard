import DownloadDropdown from '@/features/header/components/molecules/DownloadDropdown';
import { useLastUpdated } from '@/features/header/hooks/useLastUpdated';
import { fetchLastRebalanceDate } from '@/shared/api/data';
import { useFetch } from '@/shared/hooks/useFetch';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

function Header() {
	const {
		data: lastRebalance,
		loading: rebalanceLoading,
		error: rebalanceError,
	} = useFetch(fetchLastRebalanceDate);
	const lastUpdated = useLastUpdated();

	const nextRebalance = lastRebalance
		? new Date(new Date(lastRebalance.trim()).getTime() + 30 * 24 * 60 * 60 * 1000)
				.toISOString()
				.split('T')[0]
		: null;

	return (
		<div className='flex items-center justify-between'>
			<div className='flex flex-col gap-1'>
				<div className='flex items-center gap-3'>
					<p className='text-lg uppercase tracking-widest text-white/30'>luna — trading bot</p>
					<div className='flex items-center gap-1.5'>
						<span className='w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse' />
						<span className='text-xs text-white/30'>live</span>
					</div>
				</div>

				<div className='flex flex-col gap-0.5'>
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
			<DownloadDropdown />
		</div>
	);
}

export default Header;
