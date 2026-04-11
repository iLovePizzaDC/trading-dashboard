import BotNameRow from '@/features/header/components/molecules/BotNameRow';
import BotStatusGrid from '@/features/header/components/molecules/BotStatusGrid';
import BotStatusSkeleton from '@/features/header/components/molecules/BotStatusSkeleton';
import DownloadDropdown from '@/features/header/components/molecules/DownloadDropdown';
import { DAY_NAMES } from '@/features/header/constants/header';
import { useBotStatus } from '@/features/header/hooks/useBotStatus';
import { useLastUpdated } from '@/features/header/hooks/useLastUpdated';
import type { StatusDotVariant } from '@/features/header/types/status-dot';
import { fetchLastRebalanceDate } from '@/shared/api/data';
import { useFetch } from '@/shared/hooks/useFetch';
import { useState } from 'react';

function Header() {
	const { data: lastRebalance, loading, error } = useFetch(fetchLastRebalanceDate);
	const lastUpdated = useLastUpdated();
	const [expanded, setExpanded] = useState(false);

	const now = new Date();
	const dow = now.getDay();
	const isWeekday = dow >= 1 && dow <= 5;

	const dotVariant: StatusDotVariant =
		!lastRebalance && !loading ? 'inactive' : isWeekday ? 'active' : 'weekend';

	const status = useBotStatus(lastRebalance ?? null);

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
								isWeekday={isWeekday}
								dayName={DAY_NAMES[dow]}
								visible={expanded}
								lastUpdated={lastUpdated ?? undefined}
								{...status}
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
