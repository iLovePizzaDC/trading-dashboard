function TradesSkeleton() {
	return (
		<div className='rounded-xl border border-white/10 bg-white/5 p-4'>
			<div className='mb-3 flex items-baseline justify-between'>
				<div className='h-3 w-28 animate-pulse rounded bg-white/10' />
				<div className='h-4 w-20 animate-pulse rounded bg-white/10' />
			</div>
			{Array.from({ length: 4 }).map((_, i) => (
				<div
					key={i}
					className='flex items-center justify-between border-b border-white/5 py-2.5 last:border-0'
				>
					<div className='flex items-center gap-3'>
						<div className='h-3 w-8 animate-pulse rounded bg-white/10' />
						<div className='space-y-1.5'>
							<div className='h-4 w-16 animate-pulse rounded bg-white/10' />
							<div className='h-3 w-28 animate-pulse rounded bg-white/10' />
						</div>
					</div>
					<div className='space-y-1.5 text-right'>
						<div className='h-4 w-20 animate-pulse rounded bg-white/10' />
						<div className='h-3 w-16 animate-pulse rounded bg-white/10' />
					</div>
				</div>
			))}
		</div>
	);
}

export default TradesSkeleton;
