function SectorSkeleton() {
	return (
		<div className='rounded-xl border border-white/10 bg-linear-to-br from-white/5 to-white/0 p-4'>
			<div className='mb-3 flex items-center justify-between'>
				<div className='h-3 w-32 animate-pulse rounded bg-white/10' />
				<div className='flex gap-1'>
					{Array.from({ length: 4 }).map((_, i) => (
						<div key={i} className='h-4 w-12 animate-pulse rounded bg-white/10' />
					))}
				</div>
			</div>
			<div className='space-y-1.5'>
				{Array.from({ length: 3 }).map((_, i) => (
					<div key={i} className='flex items-center gap-3'>
						<div className='h-3 w-10 animate-pulse rounded bg-white/10' />
						<div className='h-3 w-28 animate-pulse rounded bg-white/10' />
						<div className='flex-1 h-1 animate-pulse rounded-full bg-white/10' />
						<div className='h-3 w-6 animate-pulse rounded bg-white/10' />
						<div className='h-3 w-20 animate-pulse rounded bg-white/10' />
					</div>
				))}
			</div>
		</div>
	);
}

export default SectorSkeleton;
