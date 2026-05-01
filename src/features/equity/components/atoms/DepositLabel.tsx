interface IDepositLabel {
	viewBox?: {
		x?: number;
		y?: number;
	};
	value?: string | number;
}

function DepositLabel({ viewBox, value }: IDepositLabel) {
	if (!viewBox?.x || !viewBox?.y) return null;

	const { x, y } = viewBox;

	return (
		<g className='pt-2'>
			<circle cx={x} cy={y} r={3} fill='rgb(168,85,247)' />

			<rect x={x + 6} y={y - 10} width={64} height={16} rx={4} fill='rgba(168,85,247,0.15)' />

			<text x={x + 10} y={y + 2} fontSize={10} fill='rgba(255,255,255,0.8)'>
				{value}
			</text>
		</g>
	);
}

export default DepositLabel;
