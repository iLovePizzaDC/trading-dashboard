function SkeletonBox({ className }: { className?: string }) {
	return (
		<div
			className={`
				relative overflow-hidden rounded-md
				bg-white/10
				${className}
			`}
		>
			<div className='absolute inset-0 animate-[shimmer_1.5s_infinite] bg-linear-to-r from-transparent via-white/20 to-transparent' />
		</div>
	);
}

function SummaryCardSkeleton() {
	return (
		<div className='space-y-4'>
			<div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
				<div className='col-span-2 rounded-xl border border-white/10 bg-linear-to-br from-white/5 to-white/0 p-4'>
					<SkeletonBox className='mb-2 h-2 w-24' />
					<SkeletonBox className='mb-3 h-9 w-48' />
					<SkeletonBox className='h-2 w-32' />
				</div>

				<div className='rounded-xl border border-white/10 bg-linear-to-br from-white/5 to-white/0 p-4'>
					<SkeletonBox className='mb-2 h-2 w-20' />
					<SkeletonBox className='mb-3 h-7 w-24' />
					<SkeletonBox className='h-2 w-16' />
				</div>

				<div className='rounded-xl border border-white/10 bg-linear-to-br from-white/5 to-white/0 p-4 flex flex-col items-center'>
					<SkeletonBox className='mb-2 h-2 w-16' />
					<SkeletonBox className='mb-3 h-5 w-20' />
					<SkeletonBox className='h-2 w-24' />
				</div>
			</div>

			<div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
				{Array.from({ length: 4 }).map((_, i) => (
					<div
						key={i}
						className='rounded-xl border border-white/10 bg-linear-to-br from-white/5 to-white/0 p-4'
					>
						<SkeletonBox className='mb-2 h-2 w-20' />
						<SkeletonBox className='mb-3 h-7 w-16' />
						<SkeletonBox className='h-2 w-12' />
					</div>
				))}
			</div>
		</div>
	);
}

export default SummaryCardSkeleton;
