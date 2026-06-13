export type Candidate = {
	symbol: string;
	momentum: number | null;
	passes_trend: boolean;
	selected: boolean;
	rejected_reason: string | null;
};

export type DecisionEntry = {
	date: string;
	candidates: Candidate[];
};
