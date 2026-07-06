function SkeletonBox({ className }: { className?: string }) {
	return (
		<div
			data-testid='skeleton-box'
			className={`relative overflow-hidden rounded-md bg-white/10 ${className}`}
		>
			<div className='absolute inset-0 animate-[shimmer_1.5s_infinite] bg-linear-to-r from-transparent via-white/20 to-transparent' />
		</div>
	);
}

function DecisionsSkeleton() {
	return (
		<div className='grid grid-cols-1 md:grid-cols-2 gap-4 items-start'>
			<div
				data-testid='decisions-card'
				className='rounded-xl border border-white/10 bg-linear-to-br from-white/5 to-white/0 p-4'
			>
				<div className='mb-3 flex justify-between'>
					<SkeletonBox className='h-3 w-28' />
					<SkeletonBox className='h-3 w-20' />
				</div>

				{Array.from({ length: 3 }).map((_, i) => (
					<div
						key={i}
						data-testid='decision-row-placeholder'
						className='flex items-center gap-3 border-b border-white/5 py-3 last:border-0'
					>
						<SkeletonBox className='h-3 w-12' />
						<SkeletonBox className='h-2 flex-1 rounded-full' />
						<SkeletonBox className='h-3 w-10' />
						<SkeletonBox className='h-3 w-20' />
					</div>
				))}

				<div data-testid='button-placeholder' className='mt-3 flex justify-center'>
					<SkeletonBox className='h-6 w-28 rounded-md' />
				</div>
			</div>

			<div
				data-testid='decision-history-card'
				className='rounded-xl border border-white/10 bg-linear-to-br from-white/5 to-white/0 p-4'
			>
				<div className='mb-4 flex justify-between'>
					<SkeletonBox className='h-3 w-32' />
					<SkeletonBox className='h-3 w-16' />
				</div>

				<div className='space-y-3'>
					{Array.from({ length: 3 }).map((_, i) => (
						<div
							key={i}
							data-testid='history-entry-placeholder'
							className='rounded-lg border border-white/10 bg-linear-to-br from-white/5 to-transparent p-3'
						>
							<div className='flex justify-between mb-2'>
								<SkeletonBox className='h-3 w-20' />
								<SkeletonBox className='h-3 w-12' />
							</div>

							<div className='flex gap-2'>
								<SkeletonBox className='h-6 w-12 rounded-md' />
								<SkeletonBox className='h-6 w-16 rounded-md' />
								<SkeletonBox className='h-6 w-14 rounded-md' />
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

export default DecisionsSkeleton;
