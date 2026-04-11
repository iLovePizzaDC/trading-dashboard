function BotStatusSkeleton() {
	return (
		<div className='flex flex-col gap-2 pt-3'>
			<div className='grid grid-cols-1 gap-2 sm:grid-cols-3'>
				{[0, 1, 2].map((i) => (
					<div
						key={i}
						className='h-18 animate-pulse rounded-lg border border-white/6 bg-white/3'
						style={{ animationDelay: `${i * 80}ms` }}
					/>
				))}
			</div>
			<div className='h-2.5 w-28 animate-pulse rounded bg-white/5' />
		</div>
	);
}

export default BotStatusSkeleton;
