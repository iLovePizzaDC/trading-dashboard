import type { FadeAction, FadeState } from '@/features/summary/constants/fade-reducer';

export function fadeReducer(state: FadeState, action: FadeAction): FadeState {
	switch (action.type) {
		case 'start_fade':
			return { ...state, isFading: true };
		case 'finish_fade':
			return { displayedTab: action.tab, isFading: false };
	}
}
