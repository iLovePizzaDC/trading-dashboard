function PositionsError() {
	return (
		<div className='rounded-xl border border-red-500/30 bg-linear-to-br from-red-500/10 to-transparent p-4'>
			<div className='mb-4 flex justify-between'>
				<p className='text-xs uppercase tracking-wider text-red-300/70'>open positions</p>
				<p className='text-xs text-red-300/50'>—</p>
			</div>

			<div className='space-y-3'>
				<p className='text-sm text-red-400'>Could not load positions</p>

				<p className='text-xs text-red-300/70'>Check if data is available or try again later.</p>
			</div>
		</div>
	);
}

export default PositionsError;
