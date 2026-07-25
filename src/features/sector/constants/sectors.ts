import type { SortKey } from '@/features/sector/types/sector-breakdown';

export const SORT_LABELS: Record<SortKey, string> = {
	timesSelected: 'selected',
	totalPnl: 'pnl',
	winRate: 'win rate',
	avgMomentumWhenSelected: 'momentum',
};
