import type { SortKey } from '@/features/sector/types/sector-breakdown';

export const SECTOR_MAP: Record<string, string> = {
	XLK: 'Technology',
	XLE: 'Energy',
	XLF: 'Financials',
	XLV: 'Health Care',
	XLI: 'Industrials',
	XLY: 'Consumer Disc.',
	XLP: 'Consumer Staples',
	XLU: 'Utilities',
	XLRE: 'Real Estate',
	XLB: 'Materials',
	XLC: 'Communication',
	QQQ: 'Nasdaq-100',
	IWM: 'Small-Cap',
	EFA: 'Intl Developed',
	GLD: 'Gold',
	TLT: 'Long Bonds',
	IEF: 'Interm. Bonds',
	SOXX: 'Semiconductors',
	SPY: 'S&P 500',
};

export const SORT_LABELS: Record<SortKey, string> = {
	timesSelected: 'selected',
	totalPnl: 'pnl',
	winRate: 'win rate',
	avgMomentumWhenSelected: 'momentum',
};
