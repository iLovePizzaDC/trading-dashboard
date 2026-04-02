function SummaryCardError() {
	return (
		<div className='space-y-3'>
			<div className='h-3 w-64 rounded bg-white/10 opacity-40' />

			<div className='grid grid-cols-2 gap-3 md:grid-cols-4'>
				<div className='col-span-2 rounded-xl border border-red-500/30 bg-linear-to-br from-red-500/10 to-transparent p-4'>
					<p className='mb-1.5 text-xs uppercase tracking-wider text-red-300/70'>portfolio value</p>

					<p className='mb-2 text-3xl font-medium text-red-400'>—</p>

					<p className='text-xs text-red-300/70'>failed to load data</p>
				</div>

				{['total return', 'regime'].map((label) => (
					<div
						key={label}
						className='rounded-xl border border-white/10 bg-linear-to-br from-white/5 to-white/0 p-4 opacity-40'
					>
						<p className='mb-1.5 text-xs uppercase tracking-wider text-white/40'>{label}</p>
						<p className='mb-2 text-2xl font-medium text-white/20'>—</p>
						<p className='text-xs text-white/20'>—</p>
					</div>
				))}
			</div>

			<div className='grid grid-cols-2 gap-3 md:grid-cols-4'>
				{['4-week return', 'vs SPY', 'max drawdown', 'sharpe ratio'].map((label) => (
					<div
						key={label}
						className='rounded-xl border border-white/10 bg-linear-to-br from-white/5 to-white/0 p-4 opacity-40'
					>
						<p className='mb-1.5 text-xs uppercase tracking-wider text-white/40'>{label}</p>
						<p className='mb-2 text-2xl font-medium text-white/20'>—</p>
						<p className='text-xs text-white/20'>—</p>
					</div>
				))}
			</div>

			<p className='text-xs text-red-300/70'>
				Could not load summary — check if data is available.
			</p>
		</div>
	);
}

export default SummaryCardError;
