export type SortKey = 'timesBought' | 'totalPnl' | 'winRate' | 'avgMomentumWhenBought';

export type SectorStat = {
	symbol: string;
	sector: string;
	timesBought: number;
	totalPnl: number;
	trades: number;
	winRate: number;
	avgMomentumWhenBought: number;
};
