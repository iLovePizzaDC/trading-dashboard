import { fadeReducer } from '@/features/summary/components/molecules/SummaryCards.reducer';
import type { FadeAction, FadeState } from '@/features/summary/constants/fade-reducer';
import { describe, expect, it } from 'vitest';

describe('fadeReducer', () => {
  describe('"start_fade" action', () => {
    it('sets isFading to true', () => {
      const state: FadeState = { displayedTab: 'overview', isFading: false };
      const action: FadeAction = { type: 'start_fade' };

      const result = fadeReducer(state, action);

      expect(result.isFading).toBe(true);
    });

    it('preserves the current displayedTab', () => {
      const state: FadeState = { displayedTab: 'capital', isFading: false };
      const action: FadeAction = { type: 'start_fade' };

      const result = fadeReducer(state, action);

      expect(result.displayedTab).toBe('capital');
    });

    it('does not mutate the original state object', () => {
      const state: FadeState = { displayedTab: 'overview', isFading: false };
      const originalState = { ...state };

      fadeReducer(state, { type: 'start_fade' });

      expect(state).toEqual(originalState);
    });
  });

  describe('"finish_fade" action', () => {
    it('sets displayedTab to the action tab and isFading to false', () => {
      const state: FadeState = { displayedTab: 'overview', isFading: true };
      const action: FadeAction = { type: 'finish_fade', tab: 'performance' };

      const result = fadeReducer(state, action);

      expect(result).toEqual({ displayedTab: 'performance', isFading: false });
    });

    it('discards any other fields from the previous state (full replacement)', () => {
      const state = {
        displayedTab: 'overview',
        isFading: true,
        extraField: 'should be gone',
      } as unknown as FadeState;
      const action: FadeAction = { type: 'finish_fade', tab: 'capital' };

      const result = fadeReducer(state, action);

      expect(result).not.toHaveProperty('extraField');
    });

    it('does not mutate the original state object', () => {
      const state: FadeState = { displayedTab: 'overview', isFading: true };
      const originalState = { ...state };

      fadeReducer(state, { type: 'finish_fade', tab: 'capital' });

      expect(state).toEqual(originalState);
    });
  });
});
