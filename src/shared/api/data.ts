import type { DecisionEntry } from '@/shared/types/decisions';
import type { EquityPoint } from '@/shared/types/equity';
import type { RegimeEntry } from '@/shared/types/regime';
import type { OpenStops, StopHistory } from '@/shared/types/stops';
import type { Summary } from '@/shared/types/summary';
import type { Trade } from '@/shared/types/trades';
import Papa from 'papaparse';

export async function fetchSummary(): Promise<Summary> {
	const res = await fetch('/data/summary.json');
	return res.json();
}

export async function fetchBotEquity(): Promise<EquityPoint[]> {
	const res = await fetch('/data/live_equity.csv');
	const text = await res.text();

	const { data } = Papa.parse<string[]>(text, { header: false });
	return data
		.filter((row) => row[0] && row[1])
		.map((row) => ({
			date: row[0],
			equity: parseFloat(row[1]),
		}));
}

export async function fetchSpyEquity(): Promise<EquityPoint[]> {
	const res = await fetch('/data/spy_equity.csv');
	const text = await res.text();

	const { data } = Papa.parse<string[]>(text, { header: false });
	return data
		.filter((row) => row[0] && row[1])
		.map((row) => ({
			date: row[0],
			equity: parseFloat(row[1]),
		}));
}

export async function fetchTrades(): Promise<Trade[]> {
	const res = await fetch('/data/live_trades.json');
	return res.json();
}

export async function fetchOpenStops(): Promise<OpenStops> {
	const res = await fetch('/data/open_stops.json');
	return res.json();
}

export async function fetchStopHistory(): Promise<StopHistory> {
	const res = await fetch('/data/stop_history.json');
	return res.json();
}

export async function fetchDecisions(): Promise<DecisionEntry[]> {
	const res = await fetch('/data/decisions_log.json');
	return res.json();
}

export async function fetchRegime(): Promise<RegimeEntry[]> {
	const res = await fetch('/data/regime_log.csv');
	const text = await res.text();
	const { data } = Papa.parse<RegimeEntry>(text, { header: true });
	return data.filter((row) => row.date);
}

export async function fetchLastRebalanceDate(): Promise<string> {
	const res = await fetch('/data/last_rebalance.txt');
	return await res.text();
}

export async function fetchLastWeeklyReportDate(): Promise<string> {
	const res = await fetch('/data/last_weekly_report.txt');
	return await res.text();
}
