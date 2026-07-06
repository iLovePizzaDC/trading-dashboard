import type { PayloadItem } from '@/features/momentum/types/momentum';
import { DateTime } from 'luxon';

interface IMomentumTooltip {
	active?: boolean;
	payload?: PayloadItem[];
	label?: string;
}

function MomentumTooltip({ active, payload }: IMomentumTooltip) {
	const date = payload?.[0]?.payload?.date ?? null;
	const formattedDate = date ? DateTime.fromISO(date).toFormat('dd MMM yyyy') : '';

	if (!active || !payload?.length) return null;

	return (
		<div className='bg-black/80 border border-white/20 rounded-lg px-3 py-2 backdrop-blur-sm shadow-lg text-xs'>
			<p className='mb-1 text-white/40' data-testid='momentum-date-paragraph'>
				{formattedDate}
			</p>
			{payload.map((p) => (
				<p key={p.name} style={{ color: p.color }}>
					{p.name}: {p.value.toFixed(1)}%
				</p>
			))}
		</div>
	);
}

export default MomentumTooltip;
