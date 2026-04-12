import BotNameRow from '@/features/header/components/molecules/BotNameRow';
import BotStatusGrid from '@/features/header/components/molecules/BotStatusGrid';
import BotStatusSkeleton from '@/features/header/components/molecules/BotStatusSkeleton';
import DownloadDropdown from '@/features/header/components/molecules/DownloadDropdown';
import { useBotStatus } from '@/features/header/hooks/useBotStatus';
import { useLastUpdated } from '@/features/header/hooks/useLastUpdated';
import type { StatusDotVariant } from '@/features/header/types/status-dot';
import { fetchLastRebalanceDate, fetchMarketStatus } from '@/shared/api/data';
import { useDataVersion } from '@/shared/hooks/useDataVersion';
import { useFetch } from '@/shared/hooks/useFetch';
import { useState } from 'react';

function Header() {
	const { data: lastRebalance, loading, error } = useFetch(fetchLastRebalanceDate);
	const { data: marketStatus } = useFetch(fetchMarketStatus);
	const lastUpdated = useLastUpdated();
	const dataVersion = useDataVersion();
	const status = useBotStatus(lastRebalance ?? null, marketStatus, dataVersion);

	const [expanded, setExpanded] = useState(false);

	const isTradingDay = status?.isTradingDay ?? false;

	const dotVariant: StatusDotVariant = (() => {
		if (!lastRebalance && !loading) return 'inactive';
		if (status?.isRunning) return 'running';
		if (isTradingDay) return 'active';
		return 'weekend';
	})();

	return (
		<div className='flex flex-col gap-3 md:flex-row md:items-start md:justify-between'>
			<div className='flex flex-col'>
				<BotNameRow
					dotVariant={dotVariant}
					expanded={expanded}
					onClick={() => setExpanded((v) => !v)}
				/>

				<div
					className={`
						grid transition-all duration-300 ease-in-out
						${expanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}
					`}
				>
					<div className='overflow-hidden'>
						{loading && <BotStatusSkeleton />}

						{error && (
							<p className='pt-3 text-xs tracking-wider text-red-400/40'>status unavailable</p>
						)}

						{status && !loading && !error && (
							<BotStatusGrid
								visible={expanded}
								marketIsOpen={marketStatus?.is_open ?? null}
								nextOpen={marketStatus?.next_open ?? null}
								nextClose={marketStatus?.next_close ?? null}
								lastUpdated={lastUpdated ?? undefined}
								{...status}
								isTradingDay={isTradingDay}
							/>
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
