function SkeletonBox({ className }: { className?: string }) {
	return (
		<div
			className={`relative overflow-hidden rounded-md bg-white/10 ${className}`}
			data-testid='stops-skeleton-box'
		>
			<div className='absolute inset-0 animate-[shimmer_1.5s_infinite] bg-linear-to-r from-transparent via-white/20 to-transparent' />
		</div>
	);
}

function StopsSkeleton() {
	return (
		<div className='rounded-xl border border-white/10 bg-linear-to-br from-white/5 to-white/0 p-4'>
			<div className='mb-3 flex items-baseline justify-between' data-testid='stops-header'>
				<SkeletonBox className='h-2.5 w-28' />
				<SkeletonBox className='h-3.5 w-16' />
			</div>

			<div className='space-y-3'>
				{[32, 24, 32, 24].map((w, i) => (
					<div key={i} data-testid='stops-group-row'>
						<div className='flex items-center justify-between mb-2'>
							<div className='flex items-center gap-2'>
								<div
									className='w-2 h-2 rounded-full bg-white/15 shrink-0'
									data-testid='stops-status-dot'
								/>
								<SkeletonBox className={`h-2.5 w-${w === 32 ? '10' : '8'}`} />
							</div>
							<SkeletonBox className='h-2.5 w-12' />
						</div>

						<div className='pl-1 flex gap-2.5'>
							<div className='flex flex-col items-center w-3 shrink-0'>
								<div
									className='w-2 h-2 rounded-full bg-white/10 mt-1.75'
									data-testid='stops-timeline-dot'
								/>
							</div>
							<div className='flex-1 flex justify-between pb-2 border-b border-white/5'>
								<div className='space-y-1.5'>
									<div className='flex items-center gap-1.5'>
										<SkeletonBox className='h-2.5 w-6' />
										<SkeletonBox className='h-2.5 w-24' />
									</div>
									<SkeletonBox className='h-2 w-20' />
								</div>
								<SkeletonBox className='h-3 w-14' />
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

export default StopsSkeleton;
