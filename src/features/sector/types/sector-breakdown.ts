export type SortKey = 'timesSelected' | 'totalPnl' | 'winRate' | 'avgMomentumWhenSelected';

export interface SectorStat {
	symbol: string;
	sector: string;
	timesSelected: number;
	totalPnl: number;
	trades: number;
	winRate: number;
	avgMomentumWhenSelected: number;
}
