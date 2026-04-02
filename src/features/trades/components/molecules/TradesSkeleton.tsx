function TradesSkeleton() {
	return (
		<div className='space-y-4'>
			<div className='grid gap-4 lg:grid-cols-[4fr_3fr]'>
				<div className='rounded-xl border border-white/10 bg-linear-to-br from-white/5 to-white/0 p-4'>
					<div className='mb-4 h-3 w-24 animate-pulse rounded bg-white/10' />
					<div className='space-y-4'>
						<div className='grid grid-cols-3 gap-3'>
							{Array.from({ length: 3 }).map((_, i) => (
								<div
									key={i}
									className='space-y-2 rounded-lg bg-linear-to-br from-white/5 to-white/0 p-3'
								>
									<div className='h-3 w-16 animate-pulse rounded bg-white/10' />
									<div className='h-5 w-12 animate-pulse rounded bg-white/10' />
									<div className='h-1 w-full animate-pulse rounded bg-white/10' />
								</div>
							))}
						</div>
						<div className='grid grid-cols-2 gap-3'>
							{Array.from({ length: 3 }).map((_, i) => (
								<div key={i} className='flex justify-between'>
									<div className='h-3 w-16 animate-pulse rounded bg-white/10' />
									<div className='h-3 w-12 animate-pulse rounded bg-white/10' />
								</div>
							))}
						</div>
						<div className='grid grid-cols-2 gap-3'>
							{Array.from({ length: 2 }).map((_, i) => (
								<div
									key={i}
									className='space-y-2 rounded-lg bg-linear-to-br from-white/5 to-white/0 p-3'
								>
									<div className='h-3 w-20 animate-pulse rounded bg-white/10' />
									<div className='h-4 w-16 animate-pulse rounded bg-white/10' />
								</div>
							))}
						</div>
					</div>
				</div>

				<div className='rounded-xl border border-white/10 bg-linear-to-br from-white/5 to-white/0 p-4'>
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
			</div>

			<div className='rounded-xl border border-white/10 bg-linear-to-br from-white/5 to-white/0 p-4'>
				<div className='mb-3 flex items-center justify-between'>
					<div className='h-3 w-36 animate-pulse rounded bg-white/10' />
					<div className='h-3 w-24 animate-pulse rounded bg-white/10' />
				</div>
				<div className='h-48 w-full animate-pulse rounded-lg bg-linear-to-br from-white/5 to-white/0' />
			</div>
		</div>
	);
}

export default TradesSkeleton;
