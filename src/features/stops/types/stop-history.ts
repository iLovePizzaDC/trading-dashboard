export type StopHistoryGroup = {
  symbol: string;
  color: string;
  entries: Array<{ date: string; old_stop: number; new_stop: number }>;
  latestStop: number;
  totalChanges: number;
};
