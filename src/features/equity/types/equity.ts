export type PayloadItem = {
	dataKey: string;
	value: number;
	payload: {
		date: string;
		equity: number;
		spy: number | null;
	};
};
