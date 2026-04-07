interface IMomentumTooltip {
	active?: boolean;
	payload?: { value: number; name: string; color: string }[];
	label?: string;
}

function MomentumTooltip({ active, payload, label }: IMomentumTooltip) {
	if (!active || !payload?.length) return null;

	return (
		<div className='bg-black/80 border border-white/20 rounded-lg px-3 py-2 backdrop-blur-sm shadow-lg text-xs'>
			<p className='mb-1 text-white/40'>{label}</p>
			{payload.map((p) => (
				<p key={p.name} style={{ color: p.color }}>
					{p.name}: {p.value.toFixed(1)}%
				</p>
			))}
		</div>
	);
}

export default MomentumTooltip;
