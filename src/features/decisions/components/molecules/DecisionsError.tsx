function DecisionsError() {
	return (
		<div className='grid grid-cols-1 md:grid-cols-2 gap-4 items-start'>
			<div className='rounded-xl border border-red-500/30 bg-linear-to-br from-red-500/10 to-transparent p-4'>
				<div className='mb-3 flex justify-between'>
					<p className='text-xs uppercase tracking-wider text-red-300/70'>last decisions</p>
					<p className='text-xs text-red-300/50'>—</p>
				</div>

				<div className='space-y-3'>
					<p className='text-sm text-red-400'>Could not load decisions</p>

					<p className='text-xs text-red-300/70'>Check if data is available or try again later.</p>
				</div>
			</div>

			<div className='rounded-xl border border-white/10 bg-linear-to-br from-white/5 to-white/0 p-4 opacity-40'>
				<div className='mb-4 flex justify-between'>
					<p className='text-xs uppercase tracking-wider text-white/40'>decision history</p>
					<p className='text-xs text-white/30'>—</p>
				</div>

				<div className='space-y-3'>
					{Array.from({ length: 4 }).map((_, i) => (
						<div
							key={i}
							className='rounded-lg border border-white/10 bg-linear-to-br from-white/5 to-transparent p-3'
						>
							<div className='flex justify-between mb-2'>
								<div className='h-3 w-20 rounded bg-white/10' />
								<div className='h-3 w-10 rounded bg-white/10' />
							</div>

							<div className='flex gap-2'>
								<div className='h-6 w-12 rounded bg-white/10' />
								<div className='h-6 w-16 rounded bg-white/10' />
								<div className='h-6 w-14 rounded bg-white/10' />
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

export default DecisionsError;
