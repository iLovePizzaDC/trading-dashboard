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
			<div className='mb-3 flex items-center justify-between'>
				<SkeletonBox className='h-3 w-32' />

				<div className='flex gap-4'>
					<SkeletonBox className='h-3 w-12' />
					<SkeletonBox className='h-3 w-12' />
				</div>
			</div>

			<SkeletonBox className='h-40 w-full rounded-lg' />
		</div>
	);
}

export default MomentumSkeleton;
