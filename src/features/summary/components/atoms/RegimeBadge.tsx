import { regimeColors } from '@/features/summary/constants/regime-badge';
import type { Regime } from '@/shared/constants/regime';

interface IRegimeBadge {
	regime: Regime;
}

function RegimeBadge({ regime }: IRegimeBadge) {
	const colors = regimeColors[regime] ?? {
		dot: 'bg-white/40',
		text: 'text-white/40',
		border: 'border-white/10',
		bg: 'bg-white/5',
		glow: '',
	};

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
					data-testid='regime-ping'
				/>
				<span
					className={`relative inline-flex h-1.5 w-1.5 rounded-full ${colors.dot}`}
					data-testid='regime-dot'
				/>
			</span>

			<span
				className={`text-xs font-semibold uppercase tracking-wider ${colors.text}`}
				data-testid='regime-badge'
			>
				{regime}
			</span>
		</div>
	);
}

export default RegimeBadge;
