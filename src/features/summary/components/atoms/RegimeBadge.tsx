interface IRegimeBadge {
	regime: string;
}

function RegimeBadge({ regime }: IRegimeBadge) {
	const isBullish = regime === 'bullish';

	return (
		<span
			className={`rounded-md px-2.5 py-1 text-xs font-semibold ${
				isBullish ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
			}`}
		>
			{regime}
		</span>
	);
}

export default RegimeBadge;
