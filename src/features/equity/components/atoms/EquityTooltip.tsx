import type { PayloadItem } from '@/features/equity/types/equity';

interface IEquityTooltip {
	active?: boolean;
	payload?: PayloadItem[];
	label?: string;
	color?: string;
	showSpy?: boolean;
	relative?: boolean;
}

function EquityTooltip({ active, payload, label, color, showSpy, relative }: IEquityTooltip) {
	if (!active || !payload?.length) return null;

	const bot = payload.find((p: PayloadItem) => p.dataKey === 'equity')?.value;
	const spy = payload.find((p: PayloadItem) => p.dataKey === 'spy')?.value;

	if (!bot) return null;

	return (
		<div className='rounded-lg border border-white/10 bg-[#1f2028] px-3 py-2 text-xs'>
			<p className='text-white/40'>{label}</p>

			<p className='font-medium' style={{ color }}>
				Bot: {relative ? `${(bot - 100).toFixed(2)}%` : `$${bot.toFixed(2)}`}
			</p>

			{showSpy && spy && (
				<p className='text-white/60'>
					SPY: {relative ? `${(spy - 100).toFixed(2)}%` : `$${spy.toFixed(2)}`}
				</p>
			)}
		</div>
	);
}

export default EquityTooltip;
