import StopGroupRow from '@/features/stops/components/atoms/StopGroupRow';
import type { StopHistoryGroup } from '@/features/stops/types/stop-history';
import Card from '@/shared/components/atoms/Card';
import ScrollableGroupList from '@/shared/components/layouts/ScrollableGroupList';
import type { StopHistory } from '@/shared/types/stops';
import { symbolColor } from '@/shared/utils/symbol-colors';
import { useMemo } from 'react';

interface IStopsCard {
	data: StopHistory;
}

function StopsCard({ data }: IStopsCard) {
	const groups = useMemo<StopHistoryGroup[]>(() => {
		return Object.entries(data)
			.map(([symbol, history]) => {
				const sorted = [...history].sort((a, b) => b.date.localeCompare(a.date));
				return {
					symbol,
					color: symbolColor(symbol),
					entries: sorted,
					latestStop: sorted[0]?.new_stop ?? 0,
					totalChanges: sorted.length,
				};
			})
			.sort((a, b) => {
				const la = a.entries[0]?.date ?? '';
				const lb = b.entries[0]?.date ?? '';
				return lb.localeCompare(la);
			});
	}, [data]);

	const totalChanges = groups.reduce((sum, g) => sum + g.totalChanges, 0);

	return (
		<Card
			title={`stop history (${totalChanges})`}
			badge={<p className='text-xs text-white/30'>{groups.length} symbols</p>}
		>
			<ScrollableGroupList
				groups={groups}
				renderGroup={(group) => <StopGroupRow group={group} />}
			/>
		</Card>
	);
}

export default StopsCard;
