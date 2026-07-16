export const SUMMARY_TABS = ['overview', 'capital', 'performance'] as const;

export type TabType = (typeof SUMMARY_TABS)[number];
