function SkeletonBox({ className }: { className?: string }) {
	return (
		<div className={`relative overflow-hidden rounded-md bg-white/10 ${className}`}>
			<div className='absolute inset-0 animate-[shimmer_1.5s_infinite] bg-linear-to-r from-transparent via-white/20 to-transparent' />
		</div>
	);
}

function StopsSkeleton() {
	return (
		<div className='rounded-xl border border-white/10 bg-linear-to-br from-white/5 to-white/0 p-4'>
			<div className='mb-3 flex items-baseline justify-between'>
				<SkeletonBox className='h-3 w-24' />
				<SkeletonBox className='h-3 w-20' />
			</div>

			{Array.from({ length: 5 }).map((_, i) => (
				<div
					key={i}
					className='flex items-center justify-between border-b border-white/5 py-2.5 last:border-0'
				>
					<div className='flex items-center gap-3'>
						<SkeletonBox className='h-3 w-12' />
						<SkeletonBox className='h-3 w-20' />
					</div>

					<div className='flex items-center gap-2'>
						<SkeletonBox className='h-3 w-16' />
						<SkeletonBox className='h-3 w-4' />
						<SkeletonBox className='h-4 w-20' />
					</div>
				</div>
			))}
		</div>
	);
}

export default StopsSkeleton;
