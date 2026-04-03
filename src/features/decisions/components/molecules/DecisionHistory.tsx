import type { DecisionEntry } from '@/shared/types/decisions';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';

interface IDecisionHistory {
	data: DecisionEntry[];
}

const ROW_HEIGHT = 128;

function getMomentumColor(value?: number) {
	if (!value) return 'bg-white/10 text-white/60';

	if (value > 0.7) return 'bg-green-500/20 text-green-300 border-green-500/30';
	if (value > 0.3) return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
	if (value > 0) return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';

	return 'bg-red-500/20 text-red-300 border-red-500/30';
}

function DecisionHistory({ data }: IDecisionHistory) {
	const parentRef = useRef<HTMLDivElement>(null);

	const sorted = [...data].sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''));

	const rowVirtualizer = useVirtualizer({
		count: sorted.length,
		getScrollElement: () => parentRef.current,
		estimateSize: () => ROW_HEIGHT,
		overscan: 6,
	});

	return (
		<div className='rounded-xl border border-white/10 bg-linear-to-br from-white/5 to-white/0 p-4'>
			<div className='mb-4 flex items-baseline justify-between'>
				<p className='text-xs uppercase tracking-wider text-white/40'>decision history</p>
				<p className='text-xs text-white/30'>{sorted.length} entries</p>
			</div>

			<div
				ref={parentRef}
				className='max-h-64 overflow-y-auto pr-3 -mr-3 [scrollbar-width:thin]
				mask-[linear-gradient(to_bottom,black_calc(100%-40px),transparent_100%)]
				[-webkit-mask-image:linear-gradient(to_bottom,black_calc(100%-40px),transparent_100%)]'
			>
				<div className='relative' style={{ height: rowVirtualizer.getTotalSize() }}>
					{rowVirtualizer.getVirtualItems().map((virtualRow) => {
						const decision = sorted[virtualRow.index];

						const top = [...decision.candidates]
							.sort((a, b) => (b.momentum ?? 0) - (a.momentum ?? 0))
							.slice(0, 3);

						return (
							<div
								key={decision.date + virtualRow.index}
								className='absolute top-0 left-0 w-full'
								style={{ transform: `translateY(${virtualRow.start}px)` }}
							>
								<div className='rounded-lg border border-white/10 bg-linear-to-br from-white/5 to-transparent p-3'>
									<div className='flex items-center justify-between mb-2'>
										<p className='text-xs text-white/40'>{decision.date}</p>

										<div className='flex items-center gap-2'>
											<span className='text-[10px] text-white/30'>
												{decision.candidates.length} picks
											</span>

											<div className='h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse' />
										</div>
									</div>

									<div className='flex gap-2 flex-wrap'>
										{top.map((c, i) => (
											<div
												key={c.symbol}
												className={`
													px-2 py-1 rounded-md text-xs border
													${getMomentumColor(c.momentum ?? undefined)}
													${i === 0 ? 'ring-1 ring-green-400/40 shadow-[0_0_10px_rgba(34,197,94,0.3)]' : ''}
												`}
											>
												<span className='font-medium'>{c.symbol}</span>
												{c.momentum !== undefined && (
													<span className='ml-1 opacity-70'>
														{c.momentum ? c.momentum.toFixed(2) : ''}
													</span>
												)}
											</div>
										))}
									</div>

									{decision.candidates.length > 3 && (
										<p className='text-[10px] text-white/30 mt-2'>
											+{decision.candidates.length - 3} more
										</p>
									)}
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}

export default DecisionHistory;
