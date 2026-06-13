import type { Trade } from '@/shared/types/trades';

export type TradeStats = {
	winRate: number;
	avgWin: number;
	avgLoss: number;
	profitFactor: number;
	bestTrade: number;
	worstTrade: number;
	avgDuration: number;
	totalTrades: number;
};

export type ClosedTrade = Trade & { pnl: number; openDate: string; closeDate: string };
