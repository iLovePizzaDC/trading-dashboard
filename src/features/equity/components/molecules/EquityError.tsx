function EquityError() {
	return (
		<div className='grid grid-cols-1 gap-4 lg:grid-cols-[3fr_2fr] items-start'>
			<div className='rounded-xl border border-red-500/20 bg-red-500/5 p-4'>
				<div className='mb-4 flex items-baseline justify-between'>
					<p className='text-xs uppercase tracking-wider text-white/40'>equity curve</p>
					<p className='text-sm text-red-400/70'>failed to load</p>
				</div>
				<div className='flex h-50 items-center justify-center'>
					<p className='text-xs text-white/30'>
						Could not load equity data — check if the bot has run at least once.
					</p>
				</div>
			</div>

			<div className='rounded-xl border border-red-500/20 bg-red-500/5 p-4'>
				<div className='mb-4'>
					<p className='text-xs uppercase tracking-wider text-white/40'>monthly performance</p>
				</div>
				<div className='flex h-20 items-center justify-center'>
					<p className='text-xs text-white/30'>No data available.</p>
				</div>
			</div>
		</div>
	);
}

export default EquityError;
