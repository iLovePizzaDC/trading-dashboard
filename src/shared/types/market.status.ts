export interface MarketStatus {
	is_trading_day: boolean | null;
	is_open: boolean | null;
	next_open: string | null;
	next_close: string | null;
}
