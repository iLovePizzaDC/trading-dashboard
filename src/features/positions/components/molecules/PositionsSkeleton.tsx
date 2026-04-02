function PositionsSkeleton() {
	return (
		<div className='rounded-xl border border-white/10 bg-linear-to-br from-white/5 to-white/0 p-4'>
			<div className='mb-3 h-3 w-32 animate-pulse rounded bg-white/10' />

			{Array.from({ length: 2 }).map((_, i) => (
				<div key={i} className='flex justify-between border-b border-white/5 py-3 last:border-0'>
					<div className='space-y-2'>
						<div className='h-4 w-20 animate-pulse rounded bg-white/10' />
						<div className='h-3 w-32 animate-pulse rounded bg-white/10' />
					</div>

					<div className='space-y-2 text-right'>
						<div className='h-4 w-20 animate-pulse rounded bg-white/10' />
						<div className='h-3 w-16 animate-pulse rounded bg-white/10' />
					</div>
				</div>
			))}
		</div>
	);
}

export default PositionsSkeleton;
