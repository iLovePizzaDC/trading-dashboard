export interface Candidate {
	symbol: string;
	momentum: number | null;
	passes_trend: boolean;
	selected: boolean;
	rejected_reason: string | null;
}

export interface DecisionEntry {
	date: string;
	candidates: Candidate[];
}
