function SkeletonBox({ className }: { className?: string }) {
	return (
		<div className={`relative overflow-hidden rounded-md bg-white/10 ${className}`}>
			<div className='absolute inset-0 animate-[shimmer_1.5s_infinite] bg-linear-to-r from-transparent via-white/20 to-transparent' />
		</div>
	);
}

function MomentumSkeleton() {
	return (
		<div className='rounded-xl border border-white/10 bg-linear-to-br from-white/5 to-white/0 p-4'>
			<div className='mb-4 flex items-baseline justify-between'>
				<SkeletonBox className='h-3 w-36' />

				<div className='flex items-center gap-4'>
					<SkeletonBox className='h-3 w-12' />
					<SkeletonBox className='h-3 w-12' />
				</div>
			</div>

			<div className='mb-3 flex gap-1 overflow-x-auto'>
				{Array.from({ length: 6 }).map((_, i) => (
					<SkeletonBox key={i} className='h-5 w-10 rounded' />
				))}
			</div>

			<SkeletonBox className='h-40 w-full rounded-lg' />
		</div>
	);
}

export default MomentumSkeleton;
