interface IRegimeBadge {
	regime: string;
}

function RegimeBadge({ regime }: IRegimeBadge) {
	const isBullish = regime === 'bullish';
	return (
		<span
			className={`inline-block rounded px-2 py-0.5 text-[11px] font-medium ${
				isBullish ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
			}`}
		>
			{regime}
		</span>
	);
}

export default RegimeBadge;
