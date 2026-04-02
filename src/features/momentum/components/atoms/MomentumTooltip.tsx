interface IMomentumTooltip {
	active?: boolean;
	payload?: { value: number; name: string; color: string }[];
	label?: string;
}

function MomentumTooltip({ active, payload, label }: IMomentumTooltip) {
	if (!active || !payload?.length) return null;

	return (
		<div className='rounded-lg border border-white/10 bg-[#1f2028] px-3 py-2 text-xs'>
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
