function EquitySkeleton() {
	return (
		<div className='grid grid-cols-1 gap-4 lg:grid-cols-[3fr_2fr] items-start'>
			<div className='rounded-xl border border-white/10 bg-white/5 p-4'>
				<div className='mb-4 flex items-baseline justify-between'>
					<div className='h-3 w-24 animate-pulse rounded bg-white/10' />
					<div className='h-4 w-20 animate-pulse rounded bg-white/10' />
				</div>

				<div className='relative h-50 w-full overflow-hidden rounded-lg bg-white/5'>
					<div className='absolute inset-0 animate-pulse bg-linear-to-b from-white/10 to-transparent' />
				</div>
			</div>

			<div className='rounded-xl border border-white/10 bg-white/5 p-4'>
				<div className='flex justify-center mb-4'>
					<div className='h-3 w-32 animate-pulse rounded bg-white/10' />
				</div>

				<div className='mb-2 grid grid-cols-[2rem_repeat(12,1fr)] gap-1'>
					<div />
					{Array.from({ length: 12 }).map((_, i) => (
						<div key={i} className='h-3 animate-pulse rounded bg-white/10' />
					))}
				</div>

				<div className='space-y-1'>
					{Array.from({ length: 4 }).map((_, row) => (
						<div key={row} className='grid grid-cols-[2rem_repeat(12,1fr)] gap-1 items-center'>
							<div className='h-3 w-6 animate-pulse rounded bg-white/10' />
							{Array.from({ length: 12 }).map((_, col) => (
								<div key={col} className='h-5 w-full animate-pulse rounded-sm bg-white/10' />
							))}
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

export default EquitySkeleton;
