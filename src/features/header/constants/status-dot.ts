import type { StatusDotVariant } from '@/features/header/types/status-dot';

export const RUN_START = { hours: 16, minutes: 29 };
export const RUN_END = { hours: 16, minutes: 35 };

export const STATUS_DOT_CONFIG: Record<
	StatusDotVariant,
	{ core: string; ring: string; animation: string }
> = {
	active: {
		core: 'bg-green-400',
		ring: 'bg-green-400',
		animation: 'animate-ping',
	},
	running: {
		core: 'bg-white',
		ring: 'bg-white',
		animation: 'animate-[ping_0.9s_ease-out_infinite]',
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
