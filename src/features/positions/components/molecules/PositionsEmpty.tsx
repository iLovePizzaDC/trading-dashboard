function PositionsEmpty() {
	return (
		<div className='rounded-xl border border-white/10 bg-white/5 p-4'>
			<p className='mb-4 text-xs uppercase tracking-wider text-white/40'>open positions</p>
			<p className='text-xs text-white/30'>No open positions.</p>
		</div>
	);
}

export default PositionsEmpty;
