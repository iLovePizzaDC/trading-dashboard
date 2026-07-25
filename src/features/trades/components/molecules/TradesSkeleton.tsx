function SkeletonBox({ className }: { className?: string }) {
	return (
		<div className={`relative overflow-hidden rounded-md bg-white/10 ${className}`}>
			<div className='absolute inset-0 animate-[shimmer_1.5s_infinite] bg-linear-to-r from-transparent via-white/20 to-transparent' />
		</div>
	);
}

function TradesSkeleton() {
	return (
		<div className='space-y-6'>
			<div className='grid gap-6 lg:grid-cols-[4fr_3fr] items-start'>
				<div className='rounded-xl border border-white/10 bg-linear-to-br from-white/5 to-white/0 p-4'>
					<div className='mb-4'>
						<SkeletonBox className='h-3 w-20' />
					</div>
					<div className='space-y-6'>
						<div className='grid grid-cols-3 gap-3'>
							<div className='space-y-2 rounded-lg bg-linear-to-br from-white/5 to-white/0 p-3'>
								<SkeletonBox className='h-2.5 w-14' />
								<SkeletonBox className='h-6 w-14' />
								<SkeletonBox className='h-1 w-full rounded-full' />
							</div>
							<div className='space-y-2 rounded-lg bg-linear-to-br from-white/5 to-white/0 p-3'>
								<SkeletonBox className='h-2.5 w-16' />
								<SkeletonBox className='h-6 w-10' />
							</div>
							<div className='space-y-2 rounded-lg bg-linear-to-br from-white/5 to-white/0 p-3'>
								<SkeletonBox className='h-2.5 w-14' />
								<SkeletonBox className='h-6 w-12' />
							</div>
						</div>

						<div className='grid grid-cols-2 gap-3'>
							{['w-14', 'w-14', 'w-20'].map((w, i) => (
								<div key={i} className='flex justify-between'>
									<SkeletonBox className={`h-2.5 ${w}`} />
									<SkeletonBox className='h-2.5 w-14' />
								</div>
							))}
						</div>

						<div className='grid grid-cols-2 gap-3'>
							<div className='space-y-1.5 rounded-lg bg-green-500/10 p-3'>
								<SkeletonBox className='h-2.5 w-16' />
								<SkeletonBox className='h-4 w-20' />
							</div>
							<div className='space-y-1.5 rounded-lg bg-red-500/10 p-3'>
								<SkeletonBox className='h-2.5 w-16' />
								<SkeletonBox className='h-4 w-20' />
							</div>
						</div>
					</div>
				</div>

				<div className='rounded-xl border border-white/10 bg-linear-to-br from-white/5 to-white/0 p-4'>
					<div className='mb-3 flex items-baseline justify-between'>
						<SkeletonBox className='h-2.5 w-28' />
						<SkeletonBox className='h-3.5 w-16' />
					</div>

					<div className='space-y-3'>
						{[32, 24, 32, 24].map((w, i) => (
							<div key={i}>
								<div className='flex items-center justify-between mb-2'>
									<div className='flex items-center gap-2'>
										<div className='w-2 h-2 rounded-full bg-white/15 shrink-0' />
										<SkeletonBox className={`h-2.5 w-${w === 32 ? '10' : '8'}`} />
									</div>
									<SkeletonBox className='h-2.5 w-12' />
								</div>

								<div className='pl-1 flex gap-2.5'>
									<div className='flex flex-col items-center w-3 shrink-0'>
										<div className='w-2 h-2 rounded-full bg-white/10 mt-1.75' />
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
			</div>

			<div className='rounded-xl border border-white/10 bg-linear-to-br from-white/5 to-white/0 p-4'>
				<div className='mb-4 flex items-center justify-between'>
					<SkeletonBox className='h-2.5 w-36' />
					<div className='flex items-center gap-3'>
						<SkeletonBox className='h-2.5 w-16' />
						<SkeletonBox className='h-2.5 w-16' />
					</div>
				</div>

				<div className='mb-3 flex gap-1.5'>
					{[16, 12, 12, 12, 12, 16].map((w, i) => (
						<SkeletonBox key={i} className={`h-5 w-${w} rounded`} />
					))}
				</div>

				<SkeletonBox className='h-48 w-full rounded-lg' />
				<SkeletonBox className='mt-2 h-2 w-56' />
			</div>
		</div>
	);
}

export default TradesSkeleton;
