import TradeGroupRow from '@/features/trades/components/atoms/TradeGroupRow';
import { groupTrades } from '@/features/trades/utils/trades-card';
import Card from '@/shared/components/atoms/Card';
import ScrollableGroupList from '@/shared/components/molecules/ScrollableGroupList'; // TODO [architecture] molecule in molecule
import type { StopHistory } from '@/shared/types/stops';
import type { Trade } from '@/shared/types/trades';
import { isPos, usd } from '@/shared/utils/currency';
import { useMemo } from 'react';

interface ITradesCard {
	data: Trade[];
	stopHistory: StopHistory;
}

function TradesCard({ data, stopHistory }: ITradesCard) {
	const groups = useMemo(() => groupTrades(data, stopHistory), [data, stopHistory]);

	const totalPnl = data
		.filter((t) => t.pnl !== undefined)
		.reduce((sum, t) => sum + (t.pnl ?? 0), 0);

	return (
		<Card
			title={`trade history (${data.length})`}
			badge={
				<p className={`text-sm font-medium ${isPos(totalPnl) ? 'text-green-400' : 'text-red-400'}`}>
					{usd(totalPnl)}
				</p>
			}
		>
			<ScrollableGroupList
				groups={groups}
				renderGroup={(group) => <TradeGroupRow group={group} />}
			/>
		</Card>
	);
}

export default TradesCard;
