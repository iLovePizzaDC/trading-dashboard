function MomentumError() {
	return (
		<div className='rounded-xl border border-red-500/20 bg-red-500/5 p-4'>
			<p className='mb-3 text-xs uppercase tracking-wider text-white/40'>momentum timeline</p>
			<div className='flex h-40 items-center justify-center'>
				<p className='text-xs text-white/30'>Could not load momentum data.</p>
			</div>
		</div>
	);
}

export default MomentumError;
