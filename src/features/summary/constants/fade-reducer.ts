import type { TabType } from '@/features/summary/types/tab';

export type FadeState = {
	displayedTab: TabType;
	isFading: boolean;
};

export type FadeAction = { type: 'start_fade' } | { type: 'finish_fade'; tab: TabType };
