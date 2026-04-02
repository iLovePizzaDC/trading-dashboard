function DecisionsError() {
	// TODO add decisionhistory skeleton
	return (
		<div className='rounded-xl border border-red-500/20 bg-red-500/5 p-4'>
			<p className='mb-3 text-xs uppercase tracking-wider text-white/40'>last decisions</p>
			<p className='text-xs text-white/30'>Could not load decisions.</p>
		</div>
	);
}

export default DecisionsError;
