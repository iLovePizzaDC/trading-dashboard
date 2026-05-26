import type { PayloadItem } from '@/features/equity/types/equity';
import { fmt } from '@/shared/utils/currency';
import { useEffect } from 'react';

interface IEquityTooltip {
	active?: boolean;
	payload?: PayloadItem[];
	label?: string;
	positive?: boolean;
	showSpy?: boolean;
	relative?: boolean;
	startValue?: number;
	onHover?: (value: number | null) => void;
}

function EquityTooltip({
	active,
	payload,
	label,
	positive,
	showSpy,
	relative,
	startValue = 0,
	onHover,
}: IEquityTooltip) {
	const bot = payload?.find((p: PayloadItem) => p.dataKey === 'equity')?.value ?? null;
	const spy = payload?.find((p: PayloadItem) => p.dataKey === 'spy')?.value ?? null;

	useEffect(() => {
		if (active && bot != null) onHover?.(bot);
		else onHover?.(null);
	}, [active, bot]); // eslint-disable-line react-hooks/exhaustive-deps

	if (!active || !payload?.length || bot == null) return null;

	return (
		<div className='bg-black/80 border border-white/20 rounded-lg px-3 py-2 backdrop-blur-sm shadow-lg text-xs'>
			<p className='text-white/40'>{label}</p>
			<p className={`font-medium ${positive ? 'text-green-400' : 'text-red-400'}`}>
				{relative ? `Bot: ${fmt(bot - 100, true)}` : `Bot: ${fmt(bot - startValue, false)}`}
			</p>

			{showSpy && spy != null && (
				<p className='text-white/60'>
					{relative ? `SPY: ${fmt(spy - 100, true)}` : `SPY: ${fmt(spy - startValue, false)}`}
				</p>
			)}
		</div>
	);
}

export default EquityTooltip;
