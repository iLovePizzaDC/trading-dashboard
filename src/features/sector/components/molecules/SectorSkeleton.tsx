function SkeletonBox({ className }: { className?: string }) {
	return (
		<div className={`relative overflow-hidden rounded-md bg-white/10 ${className}`}>
			<div className='absolute inset-0 animate-[shimmer_1.5s_infinite] bg-linear-to-r from-transparent via-white/20 to-transparent' />
		</div>
	);
}

function SectorSkeleton() {
	return (
		<div className='rounded-xl border border-white/10 bg-linear-to-br from-white/5 to-white/0 p-4'>
			<div className='mb-3 flex items-center justify-between'>
				<SkeletonBox className='h-3 w-32' />

				<div className='flex gap-2'>
					{Array.from({ length: 4 }).map((_, i) => (
						<SkeletonBox key={i} className='h-4 w-12' />
					))}
				</div>
			</div>

			<div className='space-y-1.5'>
				{Array.from({ length: 4 }).map((_, i) => (
					<div key={i} className='flex items-center gap-3'>
						<SkeletonBox className='h-3 w-10' />
						<SkeletonBox className='h-1 flex-1 rounded-full' />
						<SkeletonBox className='h-3 w-20' />
					</div>
				))}
			</div>
		</div>
	);
}

export default SectorSkeleton;
