function SkeletonBox({ className }: { className?: string }) {
	return (
		<div className={`relative overflow-hidden rounded-md bg-white/10 ${className}`}>
			<div className='absolute inset-0 animate-[shimmer_1.5s_infinite] bg-linear-to-r from-transparent via-white/20 to-transparent' />
		</div>
	);
}

function EquitySkeleton() {
	return (
		<div className='grid grid-cols-1 gap-4 lg:grid-cols-[3fr_2fr] items-start'>
			<div className='rounded-xl border border-white/10 bg-linear-to-br from-white/5 to-white/0 p-4'>
				<div className='mb-4 flex items-baseline justify-between'>
					<SkeletonBox className='h-3 w-24' />
					<SkeletonBox className='h-4 w-20' />
				</div>

				<SkeletonBox className='h-52 w-full rounded-lg' />
			</div>

			<div className='rounded-xl border border-white/10 bg-linear-to-br from-white/5 to-white/0 p-4'>
				<div className='flex justify-center mb-4'>
					<SkeletonBox className='h-3 w-32' />
				</div>

				<div className='mb-2 grid grid-cols-[2rem_repeat(12,1fr)] gap-1'>
					<div />
					{Array.from({ length: 12 }).map((_, i) => (
						<SkeletonBox key={i} className='h-3 w-full' />
					))}
				</div>

				<div className='space-y-1'>
					{Array.from({ length: 4 }).map((_, row) => (
						<div key={row} className='grid grid-cols-[2rem_repeat(12,1fr)] gap-1 items-center'>
							<SkeletonBox className='h-3 w-6' />

							{Array.from({ length: 12 }).map((_, col) => (
								<SkeletonBox key={col} className='h-5 w-full rounded-sm' />
							))}
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

export default EquitySkeleton;
