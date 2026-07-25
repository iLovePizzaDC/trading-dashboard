function TradesError() {
	return (
		<div className='space-y-4'>
			<div className='grid gap-4 lg:grid-cols-[4fr_3fr]'>
				<div className='rounded-xl border border-red-500/30 bg-linear-to-br from-red-500/10 to-transparent p-4'>
					<div className='mb-4 flex justify-between'>
						<p className='text-xs uppercase tracking-wider text-red-300/70'>trade stats</p>
						<p className='text-xs text-red-300/50'>—</p>
					</div>

					<div className='space-y-3'>
						<p className='text-sm text-red-400'>Could not load trade statistics</p>
						<p className='text-xs text-red-300/70'>
							Check if data is available or try again later.
						</p>
					</div>
				</div>

				<div className='rounded-xl border border-white/10 bg-linear-to-br from-white/5 to-white/0 p-4 opacity-40'>
					<div className='mb-3 flex justify-between'>
						<p className='text-xs uppercase tracking-wider text-white/40'>trade history</p>
						<p className='text-xs text-white/30'>—</p>
					</div>

					<div className='space-y-3'>
						{Array.from({ length: 4 }).map((_, i) => (
							<div
								key={i}
								className='flex items-center justify-between border-b border-white/5 py-2.5 last:border-0'
							>
								<div className='flex items-center gap-3'>
									<div className='h-3 w-8 rounded bg-white/10' />
									<div className='space-y-1.5'>
										<div className='h-4 w-16 rounded bg-white/10' />
										<div className='h-3 w-28 rounded bg-white/10' />
									</div>
								</div>

								<div className='space-y-1.5 text-right'>
									<div className='h-4 w-20 rounded bg-white/10 ml-auto' />
									<div className='h-3 w-16 rounded bg-white/10 ml-auto' />
								</div>
							</div>
						))}
					</div>
				</div>
			</div>

			<div className='rounded-xl border border-red-500/30 bg-linear-to-br from-red-500/10 to-transparent p-4'>
				<div className='mb-3 flex justify-between'>
					<p className='text-xs uppercase tracking-wider text-red-300/70'>entry / exit analysis</p>
					<p className='text-xs text-red-300/50'>—</p>
				</div>

				<div className='space-y-3'>
					<p className='text-sm text-red-400'>Could not load scatter data</p>
					<p className='text-xs text-red-300/70'>Check if data is available or try again later.</p>
				</div>
			</div>
		</div>
	);
}

export default TradesError;
