export interface MomentumSnapshot {
	date: string;
	avgMomentum: number;
	topMomentum: number;
	selectedCount: number;
}

export type PayloadItem = {
	value: number;
	name: string;
	color: string;
	payload: {
		date: string;
		equity: number;
		spy: number | null;
	};
};
