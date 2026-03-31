export interface Trade {
	date: string;
	symbol: string;
	action: 'buy' | 'sell';
	shares: number;
	price: number;
	stop_price?: number;
	pnl?: number; // TODO ist das wirklich im trade bot drin?
	reason?: string; // TODO ist das wirklich im trade bot drin?
}
