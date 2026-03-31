export default function SummaryCardError() {
	return (
		<div className='space-y-2.5'>
			<div className='grid grid-cols-2 gap-2.5 md:grid-cols-4'>
				<div className='col-span-2 rounded-xl border border-red-500/20 bg-red-500/5 p-4'>
					<p className='mb-1.5 text-xs uppercase tracking-wider text-white/40'>portfolio value</p>
					<p className='mb-2 text-3xl font-medium text-red-400'>—</p>
					<p className='text-xs text-red-400/70'>failed to load</p>
				</div>
				<div className='rounded-lg bg-white/5 p-4 opacity-40'>
					<p className='mb-1.5 text-xs uppercase tracking-wider text-white/40'>total return</p>
					<p className='mb-2 text-2xl font-medium text-white/20'>—</p>
					<p className='text-xs text-white/20'>since inception</p>
				</div>
				<div className='rounded-lg bg-white/5 p-4 opacity-40'>
					<p className='mb-1.5 text-xs uppercase tracking-wider text-white/40'>regime</p>
					<p className='mb-2 text-2xl font-medium text-white/20'>—</p>
					<p className='text-xs text-white/20'>unknown</p>
				</div>
			</div>
			<div className='grid grid-cols-2 gap-2.5 md:grid-cols-4'>
				{['4-week return', 'vs SPY', 'max drawdown', 'sharpe ratio'].map((label) => (
					<div key={label} className='rounded-lg bg-white/5 p-4 opacity-40'>
						<p className='mb-1.5 text-xs uppercase tracking-wider text-white/40'>{label}</p>
						<p className='mb-2 text-2xl font-medium text-white/20'>—</p>
						<p className='text-xs text-white/20'>—</p>
					</div>
				))}
			</div>
			<p className='text-left text-xs text-white/30'>
				Could not load summary — check if the bot has run at least once.
			</p>
		</div>
	);
}
