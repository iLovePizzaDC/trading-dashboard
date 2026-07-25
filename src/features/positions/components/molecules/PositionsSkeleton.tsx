function SkeletonBox({ className }: { className?: string }) {
	return (
		<div
			className={`relative overflow-hidden rounded-md bg-white/10 ${className}`}
			data-testid='positions-skeleton-box'
		>
			<div className='absolute inset-0 animate-[shimmer_1.5s_infinite] bg-linear-to-r from-transparent via-white/20 to-transparent' />
		</div>
	);
}

function PositionsSkeleton() {
	return (
		<div className='rounded-xl border border-white/10 bg-linear-to-br from-white/5 to-white/0 p-4'>
			<div className='mb-3' data-testid='positions-title'>
				<SkeletonBox className='h-3 w-32' />
			</div>

			{Array.from({ length: 2 }).map((_, i) => (
				<div
					key={i}
					className='flex justify-between border-b border-white/5 py-3 last:border-0'
					data-testid='positions-row-placeholder'
				>
					<div className='space-y-2'>
						<SkeletonBox className='h-4 w-20' />
						<SkeletonBox className='h-3 w-32' />
					</div>

					<div className='space-y-2 text-right'>
						<SkeletonBox className='h-4 w-20' />
						<SkeletonBox className='h-3 w-16 ml-auto' />
					</div>
				</div>
			))}
		</div>
	);
}

export default PositionsSkeleton;
