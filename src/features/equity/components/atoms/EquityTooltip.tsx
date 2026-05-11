import type { PayloadItem } from '@/features/equity/types/equity';
import { fmt } from '@/shared/utils/currency';

interface IEquityTooltip {
	active?: boolean;
	payload?: PayloadItem[];
	label?: string;
	positive?: boolean;
	showSpy?: boolean;
	relative?: boolean;
	startValue?: number;
}

function EquityTooltip({
	active,
	payload,
	label,
	positive,
	showSpy,
	relative,
	startValue = 0,
}: IEquityTooltip) {
	if (!active || !payload?.length) return null;

	const bot = payload.find((p: PayloadItem) => p.dataKey === 'equity')?.value;
	const spy = payload.find((p: PayloadItem) => p.dataKey === 'spy')?.value;

	if (!bot) return null;

	const botAbsDelta = bot - startValue;
	const spyAbsDelta = spy != null ? spy - startValue : 0;

	return (
		<div className='bg-black/80 border border-white/20 rounded-lg px-3 py-2 backdrop-blur-sm shadow-lg text-xs'>
			<p className='text-white/40'>{label}</p>
			<p className={`font-medium ${positive ? 'text-green-400' : 'text-red-400'}`}>
				{relative ? `Bot: ${fmt(bot - 100, relative)}` : `Bot: ${fmt(botAbsDelta, relative)}`}
			</p>

			{showSpy && spy && (
				<p className='text-white/60'>
					{relative ? `SPY: ${fmt(spy - 100, relative)}` : `SPY: ${fmt(spyAbsDelta, relative)}`}
				</p>
			)}
		</div>
	);
}

export default EquityTooltip;
