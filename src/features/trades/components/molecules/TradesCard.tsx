import TradeRow from '@/features/trades/components/atoms/TradeRow';
import ShowMoreButton from '@/shared/components/atoms/ShowMoreButton';
import { useExpandable } from '@/shared/hooks/useExpandable';
import type { Trade } from '@/shared/types/trades';

interface ITradesCard {
	data: Trade[];
}

function TradesCard({ data }: ITradesCard) {
	const sorted = [...data].sort((a, b) => b.date.localeCompare(a.date));

	const totalPnl = data
		.filter((t) => t.pnl !== undefined)
		.reduce((sum, t) => sum + (t.pnl ?? 0), 0);
	const isPos = totalPnl >= 0;

	const { expanded, toggle, hasMore, hiddenCount, previewCount } = useExpandable(sorted.length, 2);

	const preview = sorted.slice(0, previewCount);
	const extra = sorted.slice(previewCount);

	return (
		<div className='rounded-xl border border-white/10 bg-white/5 p-4'>
			<div className='mb-3 flex items-baseline justify-between'>
				<p className='text-xs uppercase tracking-wider text-white/40'>
					trade history ({data.length})
				</p>
				<p className={`text-sm font-medium ${isPos ? 'text-green-400' : 'text-red-400'}`}>
					{isPos ? '+' : ''}
					{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalPnl)}
				</p>
			</div>

			{preview.map((trade, i) => (
				<TradeRow key={`${trade.date}-${trade.symbol}-${trade.action}-${i}`} trade={trade} />
			))}

			<div
				style={{
					display: 'grid',
					gridTemplateRows: expanded ? '1fr' : '0fr',
					transition: 'grid-template-rows 0.25s ease',
				}}
			>
				<div style={{ overflow: 'hidden' }}>
					{extra.map((trade, i) => (
						<div key={`${trade.date}-${trade.symbol}-${trade.action}-${i}`}>
							<TradeRow trade={trade} />
						</div>
					))}
				</div>
			</div>

			{hasMore && <ShowMoreButton toggle={toggle} expanded={expanded} hiddenCount={hiddenCount} />}
		</div>
	);
}

export default TradesCard;
