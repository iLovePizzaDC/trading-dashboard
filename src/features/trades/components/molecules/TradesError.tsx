function TradesError() {
	return (
		<div className='space-y-4'>
			<div className='grid gap-4 lg:grid-cols-[4fr_3fr]'>
				<div className='rounded-xl border border-red-500/30 bg-linear-to-br from-red-500/10 to-transparent p-4'>
					<p className='mb-4 text-xs uppercase tracking-wider text-white/40'>trade stats</p>
					<p className='text-xs text-white/30'>Could not load trade statistics.</p>
				</div>
				<div className='rounded-xl border border-red-500/30 bg-linear-to-br from-red-500/10 to-transparent p-4'>
					<p className='mb-3 text-xs uppercase tracking-wider text-white/40'>trade history</p>
					<p className='text-xs text-white/30'>Could not load trade history.</p>
				</div>
			</div>
			<div className='rounded-xl border border-red-500/30 bg-linear-to-br from-red-500/10 to-transparent p-4'>
				<p className='mb-3 text-xs uppercase tracking-wider text-white/40'>entry / exit analysis</p>
				<div className='flex h-48 items-center justify-center'>
					<p className='text-xs text-white/30'>Could not load scatter data.</p>
				</div>
			</div>
		</div>
	);
}

export default TradesError;
