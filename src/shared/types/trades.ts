export type Trade = {
	date: string;
	symbol: string;
	action: 'buy' | 'sell';
	shares: number;
	price: number;
	stop_price?: number;
	pnl?: number;
	reason?: string;
};
