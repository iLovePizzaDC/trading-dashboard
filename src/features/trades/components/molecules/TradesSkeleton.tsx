function SkeletonBox({ className }: { className?: string }) {
	return (
		<div className={`relative overflow-hidden rounded-md bg-white/10 ${className}`}>
			<div className='absolute inset-0 animate-[shimmer_1.5s_infinite] bg-linear-to-r from-transparent via-white/20 to-transparent' />
		</div>
	);
}

function TradesSkeleton() {
	return (
		<div className='space-y-4'>
			<div className='grid gap-4 lg:grid-cols-[4fr_3fr]'>
				<div className='rounded-xl border border-white/10 bg-linear-to-br from-white/5 to-white/0 p-4'>
					<div className='mb-4'>
						<SkeletonBox className='h-3 w-24' />
					</div>

					<div className='space-y-4'>
						<div className='grid grid-cols-3 gap-3'>
							{Array.from({ length: 3 }).map((_, i) => (
								<div
									key={i}
									className='space-y-2 rounded-lg bg-linear-to-br from-white/5 to-white/0 p-3'
								>
									<SkeletonBox className='h-3 w-16' />
									<SkeletonBox className='h-5 w-12' />
									<SkeletonBox className='h-1 w-full rounded-full' />
								</div>
							))}
						</div>

						<div className='grid grid-cols-2 gap-3'>
							{Array.from({ length: 3 }).map((_, i) => (
								<div key={i} className='flex justify-between'>
									<SkeletonBox className='h-3 w-16' />
									<SkeletonBox className='h-3 w-12' />
								</div>
							))}
						</div>

						<div className='grid grid-cols-2 gap-3'>
							{Array.from({ length: 2 }).map((_, i) => (
								<div
									key={i}
									className='space-y-2 rounded-lg bg-linear-to-br from-white/5 to-white/0 p-3'
								>
									<SkeletonBox className='h-3 w-20' />
									<SkeletonBox className='h-4 w-16' />
								</div>
							))}
						</div>
					</div>
				</div>

				<div className='rounded-xl border border-white/10 bg-linear-to-br from-white/5 to-white/0 p-4'>
					<div className='mb-3 flex items-baseline justify-between'>
						<SkeletonBox className='h-3 w-28' />
						<SkeletonBox className='h-4 w-20' />
					</div>

					{Array.from({ length: 4 }).map((_, i) => (
						<div
							key={i}
							className='flex items-center justify-between border-b border-white/5 py-2.5 last:border-0'
						>
							<div className='flex items-center gap-3'>
								<SkeletonBox className='h-3 w-8' />
								<div className='space-y-1.5'>
									<SkeletonBox className='h-4 w-16' />
									<SkeletonBox className='h-3 w-28' />
								</div>
							</div>
							<div className='space-y-1.5 text-right'>
								<SkeletonBox className='h-4 w-20 ml-auto' />
								<SkeletonBox className='h-3 w-16 ml-auto' />
							</div>
						</div>
					))}
				</div>
			</div>

			<div className='rounded-xl border border-white/10 bg-linear-to-br from-white/5 to-white/0 p-4'>
				<div className='mb-4 flex items-center justify-between'>
					<SkeletonBox className='h-3 w-36' />
					<SkeletonBox className='h-3 w-24' />
				</div>

				<div className='mb-3 flex gap-1'>
					{Array.from({ length: 6 }).map((_, i) => (
						<SkeletonBox key={i} className='h-5 w-8 rounded' />
					))}
				</div>

				<SkeletonBox className='h-48 w-full rounded-lg' />
			</div>
		</div>
	);
}

export default TradesSkeleton;
