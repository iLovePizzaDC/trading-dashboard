import type { MomentumSnapshot } from '@/features/momentum/types/momentum';
import type { DecisionEntry } from '@/shared/types/decisions';

export function calcMomentumTimeline(decisions: DecisionEntry[]): MomentumSnapshot[] {
	return decisions.map(({ date, candidates }) => {
		const valid = candidates.filter((c) => c.momentum !== null);
		const selected = candidates.filter((c) => c.selected);
		const avg = valid.reduce((sum, c) => sum + (c.momentum ?? 0), 0) / (valid.length || 1);
		const top = Math.max(...valid.map((c) => c.momentum ?? 0));

		return {
			date,
			avgMomentum: parseFloat((avg * 100).toFixed(2)),
			topMomentum: parseFloat((top * 100).toFixed(2)),
			selectedCount: selected.length,
		};
	});
}
