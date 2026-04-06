interface IRegimeBadge {
	regime: string;
}

function RegimeBadge({ regime }: IRegimeBadge) {
	const isBullish = regime === 'bullish';

	return (
		<span
			className={`
				rounded-md px-2.5 py-1 text-xs font-semibold border
				${
					isBullish
						? 'bg-green-500/20 text-green-300 border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.3)]'
						: 'bg-red-500/20 text-red-300 border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.3)]'
				}
			`}
		>
			{regime}
		</span>
	);
}

export default RegimeBadge;
