function EquityError() {
	return (
		<div className='grid grid-cols-1 gap-4 lg:grid-cols-[3fr_2fr] items-start'>
			<div className='rounded-xl border border-red-500/20 bg-red-500/5 p-4'>
				<div className='mb-4 flex items-baseline justify-between'>
					<p className='text-xs uppercase tracking-wider text-white/40'>equity curve</p>
					<p className='text-sm text-red-400/70'>error</p>
				</div>

				<div className='flex h-50 items-center justify-center text-center'>
					<p className='text-xs text-white/40 max-w-55'>
						No equity data available. Either the bot hasn't run yet or the API failed.
					</p>
				</div>
			</div>

			<div className='rounded-xl border border-red-500/20 bg-red-500/5 p-4'>
				<div className='mb-4'>
					<p className='text-xs uppercase tracking-wider text-white/40'>monthly performance</p>
				</div>

				<div className='flex h-30 items-center justify-center text-center'>
					<p className='text-xs text-white/40'>Not enough data to calculate monthly returns.</p>
				</div>
			</div>
		</div>
	);
}

export default EquityError;
