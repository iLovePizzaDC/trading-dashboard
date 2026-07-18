export interface ChartPoint {
  date: string;
  equity: number;
  spy: number | null;
}

export type PayloadItem = {
  dataKey: string;
  value: number;
  payload: ChartPoint;
};
