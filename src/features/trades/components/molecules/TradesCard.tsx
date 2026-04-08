import TradeGroupRow from '@/features/trades/components/atoms/TradeGroupRow';
import { groupTrades } from '@/features/trades/utils/trades-card';
import Card from '@/shared/components/atoms/Card';
import type { Trade } from '@/shared/types/trades';
import { usd } from '@/shared/utils/currency';
import { useEffect, useMemo, useRef, useState } from 'react';

interface ITradesCard {
	data: Trade[];
}

function TradesCard({ data }: ITradesCard) {
	const groups = useMemo(() => groupTrades(data), [data]);
	const scrollRef = useRef<HTMLDivElement>(null);
	const [canScroll, setCanScroll] = useState(false);

	useEffect(() => {
		const el = scrollRef.current;
		if (!el) return;

		const check = () => setCanScroll(el.scrollHeight > el.clientHeight);
		check();

		const ro = new ResizeObserver(check);
		ro.observe(el);
		return () => ro.disconnect();
	}, [groups]);

	const totalPnl = data
		.filter((t) => t.pnl !== undefined)
		.reduce((sum, t) => sum + (t.pnl ?? 0), 0);

	const isPos = totalPnl >= 0;
	const totalPnlFormatted = usd(totalPnl);

	return (
		<Card
			title={`trade history (${data.length})`}
			badge={
				<p className={`text-sm font-medium ${isPos ? 'text-green-400' : 'text-red-400'}`}>
					{totalPnlFormatted}
				</p>
			}
		>
			<div
				ref={scrollRef}
				className='max-h-64 overflow-y-auto pr-3 -mr-3 [scrollbar-width:thin]'
				style={
					canScroll
						? {
								maskImage: 'linear-gradient(to bottom, black calc(100% - 40px), transparent 100%)',
								WebkitMaskImage:
									'linear-gradient(to bottom, black calc(100% - 40px), transparent 100%)',
							}
						: undefined
				}
			>
				{groups.map((group, index) => (
					<div key={group.symbol}>
						<TradeGroupRow group={group} />
						{index < groups.length - 1 && (
							<div className='bg-linear-to-r from-transparent via-white/20 to-transparent h-px my-3' />
						)}
					</div>
				))}
			</div>
		</Card>
	);
}

export default TradesCard;
