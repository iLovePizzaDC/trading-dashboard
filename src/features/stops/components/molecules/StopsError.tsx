function StopsError() {
	return (
		<div className='rounded-xl border border-red-500/20 bg-red-500/5 p-4'>
			<p className='mb-3 text-xs uppercase tracking-wider text-white/40'>stop history</p>
			<p className='text-xs text-white/30'>Could not load stop history.</p>
		</div>
	);
}

export default StopsError;
