import PositionRow from '@/features/positions/components/atoms/PositionRow';
import PositionsEmpty from '@/features/positions/components/molecules/PositionsEmpty';
import ShowMoreButton from '@/shared/components/atoms/ShowMoreButton';
import { useExpandable } from '@/shared/hooks/useExpandable';
import type { OpenStops } from '@/shared/types/stops';
import type { Trade } from '@/shared/types/trades';

interface IOpenPositions {
	stops: OpenStops;
	trades: Trade[];
}

function OpenPositions({ stops, trades }: IOpenPositions) {
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
		<div className='rounded-xl border border-white/10 bg-linear-to-br from-white/5 to-white/0 p-4 transition-colors duration-300 hover:border-white/20'>
			<div className='mb-2 flex items-center gap-2'>
				<span className='w-1 h-4 bg-purple-500 rounded-full' />
				<p className='text-xs uppercase tracking-wider text-white/40'>
					open positions ({symbols.length})
				</p>
			</div>

			{preview.map((symbol, index) => (
				<div key={symbol}>
					<PositionRow
						key={symbol}
						symbol={symbol}
						stop={stops[symbol]}
						trade={lastBuy[symbol]}
						isLast={index === preview.length - 1 && (!expanded || extra.length === 0)}
					/>
					{index < preview.length - 1 && (
						<div className='bg-linear-to-r from-transparent via-white/20 to-transparent h-px' />
					)}
				</div>
			))}

			<div
				className={`grid transition-[grid-template-rows] duration-250 ease-in-out ${
					expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
				}`}
			>
				<div className='overflow-hidden'>
					{extra.map((symbol, index) => (
						<div key={symbol}>
							<PositionRow
								symbol={symbol}
								stop={stops[symbol]}
								trade={lastBuy[symbol]}
								isLast={index === extra.length - 1}
							/>
						</div>
					))}
				</div>
			</div>

			{hasMore && <ShowMoreButton toggle={toggle} expanded={expanded} hiddenCount={hiddenCount} />}
		</div>
	);
}

export default OpenPositions;
