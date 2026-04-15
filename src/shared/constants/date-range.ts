export const RANGES = ['1W', '1M', '3M', '6M', 'YTD', 'ALL'] as const;

export type Range = (typeof RANGES)[number];
