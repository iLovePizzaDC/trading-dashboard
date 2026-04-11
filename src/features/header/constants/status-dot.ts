import type { StatusDotVariant } from '@/features/header/types/status-dot';

export const STATUS_DOT_VARIANTS: Record<
	StatusDotVariant,
	{ core: string; ring: string; animation: string }
> = {
	active: {
		core: 'bg-green-400',
		ring: 'bg-green-400',
		animation: 'animate-ping',
	},
	weekend: {
		core: 'bg-amber-400/60',
		ring: 'bg-amber-400',
		animation: 'animate-[ping_2.8s_ease-out_infinite]',
	},
	inactive: {
		core: 'bg-white/10',
		ring: '',
		animation: '',
	},
};
