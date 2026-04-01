export type OpenStops = Record<string, number>;

export interface StopHistoryEntry {
	date: string;
	old_stop: number;
	new_stop: number;
}

export type StopHistory = Record<string, StopHistoryEntry[]>;
