import ShowMoreButton from '@/shared/components/atoms/ShowMoreButton';
import { useExpandable } from '@/shared/hooks/useExpandable';
import type { OpenStops } from '@/shared/types/stops';
import type { Trade } from '@/shared/types/trades';
import PositionRow from '../atoms/PositionRow';
import PositionsEmpty from './PositionsEmpty';

interface IPositionsCard {
	stops: OpenStops;
	trades: Trade[];
}

function PositionsCard({ stops, trades }: IPositionsCard) {
	const symbols = Object.keys(stops);
	if (symbols.length === 0) return <PositionsEmpty />;

	const lastBuy = trades.reduce<Record<string, Trade>>((acc, t) => {
		if (t.action === 'buy') acc[t.symbol] = t;
		return acc;
	}, {});

	const { expanded, toggle, hasMore, hiddenCount, previewCount } = useExpandable(symbols.length, 2);

	const preview = symbols.slice(0, previewCount);
	const extra = symbols.slice(previewCount);

	return (
		<div className='rounded-xl border border-white/10 bg-white/5 p-4'>
			<p className='mb-2 text-xs uppercase tracking-wider text-white/40'>
				open positions ({symbols.length})
			</p>

			{preview.map((symbol) => (
				<PositionRow key={symbol} symbol={symbol} stop={stops[symbol]} trade={lastBuy[symbol]} />
			))}

			<div
				style={{
					display: 'grid',
					gridTemplateRows: expanded ? '1fr' : '0fr',
					transition: 'grid-template-rows 0.25s ease',
				}}
			>
				<div style={{ overflow: 'hidden' }}>
					{extra.map((symbol, i) => (
						<div key={symbol}>
							<PositionRow symbol={symbol} stop={stops[symbol]} trade={lastBuy[symbol]} />
						</div>
					))}
				</div>
			</div>

			{hasMore && <ShowMoreButton toggle={toggle} expanded={expanded} hiddenCount={hiddenCount} />}
		</div>
	);
}

export default PositionsCard;
