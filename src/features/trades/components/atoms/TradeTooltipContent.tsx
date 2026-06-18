import type { ClosedTrade } from '@/features/trades/types/trade-statistics';
import { useRotateSectorName } from '@/shared/hooks/useRotateSymbolName';
import { usd } from '@/shared/utils/currency';
import { DateTime } from 'luxon';

interface ITradeTooltipContent {
	trade: ClosedTrade;
}

function TradeTooltipContent({ trade }: ITradeTooltipContent) {
	const { displayName, visible } = useRotateSectorName(trade.symbol);

	const openDate = DateTime.fromISO(trade.openDate);
	const closeDate = DateTime.fromISO(trade.closeDate);

	const openLabel = openDate.isValid ? openDate.toFormat('dd MMM yyyy') : trade.openDate;
	const closeLabel = closeDate.isValid ? closeDate.toFormat('dd MMM yyyy') : trade.closeDate;

	return (
		<div className='space-y-0.5'>
			<p
				className={`font-semibold transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
			>
				{displayName}
			</p>
			<p>
				{openLabel} → {closeLabel}
			</p>
			<p>
				{trade.shares} @ {usd(trade.price)}
			</p>
		</div>
	);
}

export default TradeTooltipContent;
