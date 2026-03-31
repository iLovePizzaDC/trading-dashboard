function EquityChartSkeleton() {
	return (
		<div className='rounded-xl border border-white/10 bg-white/5 p-4'>
			<div className='mb-4 flex items-baseline justify-between'>
				<div className='h-3 w-24 animate-pulse rounded bg-white/10' />
				<div className='h-4 w-20 animate-pulse rounded bg-white/10' />
			</div>
			<div className='h-48 w-full animate-pulse rounded-lg bg-white/5' />
		</div>
	);
}

export default EquityChartSkeleton;
