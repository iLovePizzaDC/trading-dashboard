function SkeletonBox({ className }: { className?: string }) {
	return <div className={`animate-pulse rounded-md bg-white/10 ${className}`} />;
}

export default function SummaryCardSkeleton() {
	return (
		<div className='space-y-2.5'>
			<div className='grid grid-cols-2 gap-2.5 md:grid-cols-4'>
				<div className='col-span-2 rounded-xl border border-white/10 bg-white/5 p-4'>
					<SkeletonBox className='mb-2 h-3 w-24' />
					<SkeletonBox className='mb-3 h-9 w-40' />
					<SkeletonBox className='h-3 w-32' />
				</div>
				<div className='rounded-lg bg-white/5 p-4'>
					<SkeletonBox className='mb-2 h-3 w-20' />
					<SkeletonBox className='mb-3 h-8 w-24' />
					<SkeletonBox className='h-3 w-16' />
				</div>
				<div className='rounded-lg bg-white/5 p-4'>
					<SkeletonBox className='mb-2 h-3 w-16' />
					<SkeletonBox className='mb-3 h-6 w-20' />
					<SkeletonBox className='h-3 w-24' />
				</div>
			</div>
			<div className='grid grid-cols-2 gap-2.5 md:grid-cols-4'>
				{Array.from({ length: 4 }).map((_, i) => (
					<div key={i} className='rounded-lg bg-white/5 p-4'>
						<SkeletonBox className='mb-2 h-3 w-20' />
						<SkeletonBox className='mb-3 h-8 w-16' />
						<SkeletonBox className='h-3 w-12' />
					</div>
				))}
			</div>
		</div>
	);
}
