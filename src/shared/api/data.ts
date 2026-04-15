import type { DecisionEntry } from '@/shared/types/decisions';
import type { EquityPoint } from '@/shared/types/equity';
import type { MarketStatus } from '@/shared/types/market.status';
import type { RegimeEntry } from '@/shared/types/regime';
import type { OpenStops, StopHistory } from '@/shared/types/stops';
import type { Summary } from '@/shared/types/summary';
import type { Trade } from '@/shared/types/trades';
import Papa from 'papaparse';

export async function fetchSummary(version: string): Promise<Summary> {
	const res = await fetch(`/data/summary.json?v=${version}`);
	return res.json();
}

export async function fetchBotEquity(version: string): Promise<EquityPoint[]> {
	const res = await fetch(`/data/live_equity.csv?v=${version}`);
	const text = await res.text();

	const { data } = Papa.parse<string[]>(text, { header: false });
	return data
		.filter((row) => row[0] && row[1])
		.map((row) => ({
			date: row[0],
			equity: parseFloat(row[1]),
			spy: null,
		}));
}

export async function fetchSpyEquity(version: string): Promise<EquityPoint[]> {
	const res = await fetch(`/data/spy_equity.csv?v=${version}`);
	const text = await res.text();

	const { data } = Papa.parse<string[]>(text, { header: false });
	return data
		.filter((row) => row[0] && row[1])
		.map((row) => ({
			date: row[0],
			equity: parseFloat(row[1]),
			spy: null,
		}));
}

export async function fetchTrades(version: string): Promise<Trade[]> {
	const res = await fetch(`/data/live_trades.json?v=${version}`);
	return res.json();
}

export async function fetchOpenStops(version: string): Promise<OpenStops> {
	const res = await fetch(`/data/open_stops.json?v=${version}`);
	return res.json();
}

export async function fetchStopHistory(version: string): Promise<StopHistory> {
	const res = await fetch(`/data/stop_history.json?v=${version}`);
	return res.json();
}

export async function fetchDecisions(version: string): Promise<DecisionEntry[]> {
	const res = await fetch(`/data/decisions_log.json?v=${version}`);
	return res.json();
}

export async function fetchRegime(version: string): Promise<RegimeEntry[]> {
	const res = await fetch(`/data/regime_log.csv?v=${version}`);
	const text = await res.text();
	const { data } = Papa.parse<RegimeEntry>(text, { header: true });
	return data.filter((row) => row.date);
}

export async function fetchLastRebalanceDate(version: string): Promise<string> {
	const res = await fetch(`/data/last_rebalance.txt?v=${version}`);
	return await res.text();
}

export async function fetchLastWeeklyReportDate(version: string): Promise<string> {
	const res = await fetch(`/data/last_weekly_report.txt?v=${version}`);
	return await res.text();
}

export async function fetchMarketStatus(version: string): Promise<MarketStatus> {
	const res = await fetch(`/data/market_status.json?v=${version}`);
	return await res.json();
}
