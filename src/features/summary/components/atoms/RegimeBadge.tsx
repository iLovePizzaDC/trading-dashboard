import { regimeColors } from '@/features/summary/constants/regime-badge';
import type { Regime } from '@/shared/constants/regime';

interface IRegimeBadge {
	regime: Regime;
}

function RegimeBadge({ regime }: IRegimeBadge) {
	const colors = regimeColors[regime];

	return (
		<div
			className={`
			inline-flex items-center gap-2
			rounded-lg border px-3 py-1.5 my-1
			${colors.bg} ${colors.border} ${colors.glow}
		`}
		>
			<span className='relative flex h-1.5 w-1.5'>
				<span
					className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${colors.dot}`}
				/>
				<span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${colors.dot}`} />
			</span>

			<span className={`text-xs font-semibold uppercase tracking-wider ${colors.text}`}>
				{regime}
			</span>
		</div>
	);
}

export default RegimeBadge;
