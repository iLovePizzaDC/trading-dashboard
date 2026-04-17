import type { Regime } from '@/shared/constants/regime';

export interface Summary {
	last_run: string;
	portfolio_value: number;
	total_return: number;
	cagr: number;
	max_dd: number;
	sharpe: number;
	total_invested: number;
	profit: number;
	rolling_4w: number | null;
	spy_4w: number | null;
	regime: Regime;
	total_trades: number;
	winrate: number;
	avg_win: number;
	avg_loss: number;
}
