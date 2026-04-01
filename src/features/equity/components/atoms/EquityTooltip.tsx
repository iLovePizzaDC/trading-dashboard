interface IEquityTooltip {
	active?: boolean;
	payload?: { value: number }[];
	label?: string;
}

function EquityTooltip({ active, payload, label }: IEquityTooltip) {
	if (!active || !payload?.length) return null;

	const value = payload[0].value;

	return (
		<div className='rounded-lg border border-white/10 bg-[#1f2028] px-3 py-2 text-xs'>
			<p className='text-white/40'>{label}</p>
			<p className='font-medium text-white'>
				{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)}
			</p>
		</div>
	);
}

export default EquityTooltip;
