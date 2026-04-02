function MomentumSkeleton() {
	return (
		<div className='rounded-xl border border-white/10 bg-linear-to-br from-white/5 to-white/0 p-4'>
			<div className='mb-3 flex items-center justify-between'>
				<div className='h-3 w-32 animate-pulse rounded bg-white/10' />
				<div className='flex gap-4'>
					<div className='h-3 w-12 animate-pulse rounded bg-white/10' />
					<div className='h-3 w-12 animate-pulse rounded bg-white/10' />
				</div>
			</div>

			<div className='h-40 w-full animate-pulse rounded-lg bg-linear-to-br from-white/5 to-white/0' />
		</div>
	);
}

export default MomentumSkeleton;
