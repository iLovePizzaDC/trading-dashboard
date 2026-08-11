import type { SortKey } from '@/features/sector/types/sector-breakdown';

export const SORT_LABELS: Record<SortKey, string> = {
	timesBought: 'bought',
	totalPnl: 'pnl',
	winRate: 'win rate',
	avgMomentumWhenBought: 'momentum',
};
