import type { Trade } from '@/shared/types/trades';

export type TradeGroup = {
	symbol: string;
	color: string;
	entries: Trade[];
	closedPnl: number;
	isOpen: boolean;
};
