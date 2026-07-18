interface IDepositLabel {
  viewBox?: {
    x?: number;
    y?: number;
  };
  value?: string | number;
}

function DepositLabel({ viewBox, value }: IDepositLabel) {
  if (viewBox?.x == null) return null;

  const x = viewBox.x;
  const y = 8;

  return (
    <g>
      <rect
        x={x + 6}
        y={y}
        width={64}
        height={16}
        rx={4}
        fill='rgba(168,85,247,0.15)'
        data-testid='deposit-rect'
      />
      <text
        x={x + 10}
        y={y + 11}
        fontSize={10}
        fill='rgba(255,255,255,0.8)'
        data-testid='deposit-text'
      >
        {value}
      </text>
    </g>
  );
}

export default DepositLabel;
