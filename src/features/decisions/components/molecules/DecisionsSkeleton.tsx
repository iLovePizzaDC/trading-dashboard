function DecisionsSkeleton() {
	// TODO add decisionhistory skeleton
	return (
		<div className='rounded-xl border border-white/10 bg-linear-to-br from-white/5 to-white/0 p-4'>
			<div className='mb-3 flex items-baseline justify-between'>
				<div className='h-3 w-28 animate-pulse rounded bg-white/10' />
				<div className='h-3 w-20 animate-pulse rounded bg-white/10' />
			</div>
			{Array.from({ length: 8 }).map((_, i) => (
				<div
					key={i}
					className='flex items-center gap-3 border-b border-white/5 py-2.5 last:border-0'
				>
					<div className='h-3 w-12 animate-pulse rounded bg-white/10' />
					<div className='h-1 flex-1 animate-pulse rounded-full bg-white/10' />
					<div className='h-3 w-10 animate-pulse rounded bg-white/10' />
					<div className='h-3 w-24 animate-pulse rounded bg-white/10' />
				</div>
			))}
		</div>
	);
}

export default DecisionsSkeleton;
