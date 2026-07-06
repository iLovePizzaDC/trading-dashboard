import type { MomentumSnapshot } from '@/features/momentum/types/momentum';
import { calcMomentumTimeline } from '@/features/momentum/utils/momentum';
import type { Candidate, DecisionEntry } from '@/shared/types/decisions';
import { describe, expect, it } from 'vitest';

function buildCandidate(overrides: Partial<Candidate> = {}): Candidate {
	return {
		symbol: 'XLK',
		momentum: 0.1,
		passes_trend: true,
		selected: false,
		rejected_reason: null,
		...overrides,
	} as Candidate;
}

function buildDecision(overrides: Partial<DecisionEntry> = {}): DecisionEntry {
	return {
		date: '2026-07-01',
		candidates: [],
		...overrides,
	} as DecisionEntry;
}

describe('calcMomentumTimeline', () => {
	it('returns an empty array when decisions is empty', () => {
		expect(calcMomentumTimeline([])).toEqual([]);
	});

	it('returns one snapshot per decision, preserving the date', () => {
		const decisions = [
			buildDecision({ date: '2026-07-01' }),
			buildDecision({ date: '2026-07-02' }),
		];

		const result = calcMomentumTimeline(decisions);

		expect(result.map((r: MomentumSnapshot) => r.date)).toEqual(['2026-07-01', '2026-07-02']);
	});

	it('calculates the average momentum across candidates as a percentage', () => {
		const decisions = [
			buildDecision({
				candidates: [
					buildCandidate({ momentum: 0.1 }),
					buildCandidate({ momentum: 0.2 }),
					buildCandidate({ momentum: 0.3 }),
				],
			}),
		];

		const result = calcMomentumTimeline(decisions);

		expect(result[0].avgMomentum).toBe(20);
	});

	it('calculates the top momentum across candidates as a percentage', () => {
		const decisions = [
			buildDecision({
				candidates: [
					buildCandidate({ momentum: 0.1 }),
					buildCandidate({ momentum: 0.35 }),
					buildCandidate({ momentum: 0.2 }),
				],
			}),
		];

		const result = calcMomentumTimeline(decisions);

		expect(result[0].topMomentum).toBe(35);
	});

	it('rounds avgMomentum and topMomentum to two decimal places', () => {
		const decisions = [
			buildDecision({
				candidates: [
					buildCandidate({ momentum: 0.123456 }),
					buildCandidate({ momentum: 0.234567 }),
				],
			}),
		];

		const result = calcMomentumTimeline(decisions);

		expect(result[0].avgMomentum).toBe(17.9);
		expect(result[0].topMomentum).toBe(23.46);
	});

	it('counts the number of selected candidates', () => {
		const decisions = [
			buildDecision({
				candidates: [
					buildCandidate({ selected: true }),
					buildCandidate({ selected: false }),
					buildCandidate({ selected: true }),
				],
			}),
		];

		const result = calcMomentumTimeline(decisions);

		expect(result[0].selectedCount).toBe(2);
	});

	it('returns 0 for selectedCount when no candidates are selected', () => {
		const decisions = [
			buildDecision({
				candidates: [buildCandidate({ selected: false }), buildCandidate({ selected: false })],
			}),
		];

		const result = calcMomentumTimeline(decisions);

		expect(result[0].selectedCount).toBe(0);
	});

	it('excludes candidates with null momentum from the average and top calculations', () => {
		const decisions = [
			buildDecision({
				candidates: [
					buildCandidate({ momentum: null }),
					buildCandidate({ momentum: 0.2 }),
					buildCandidate({ momentum: 0.4 }),
				],
			}),
		];

		const result = calcMomentumTimeline(decisions);

		expect(result[0].avgMomentum).toBe(30);
		expect(result[0].topMomentum).toBe(40);
	});

	it('still counts selected candidates even if their momentum is null', () => {
		const decisions = [
			buildDecision({
				candidates: [buildCandidate({ momentum: null, selected: true })],
			}),
		];

		const result = calcMomentumTimeline(decisions);

		expect(result[0].selectedCount).toBe(1);
	});

	it('returns avgMomentum of 0 when there are no candidates at all', () => {
		const decisions = [buildDecision({ candidates: [] })];

		const result = calcMomentumTimeline(decisions);

		expect(result[0].avgMomentum).toBe(0);
	});

	it('returns avgMomentum of 0 when every candidate has null momentum', () => {
		const decisions = [
			buildDecision({
				candidates: [buildCandidate({ momentum: null }), buildCandidate({ momentum: null })],
			}),
		];

		const result = calcMomentumTimeline(decisions);

		expect(result[0].avgMomentum).toBe(0);
	});

	it('returns -Infinity for topMomentum when there are no candidates with valid momentum', () => {
		const decisions = [buildDecision({ candidates: [] })];

		const result = calcMomentumTimeline(decisions);

		expect(result[0].topMomentum).toBe(-Infinity);
	});

	it('handles a mix of zero and negative momentum values correctly', () => {
		const decisions = [
			buildDecision({
				candidates: [
					buildCandidate({ momentum: -0.1 }),
					buildCandidate({ momentum: 0 }),
					buildCandidate({ momentum: -0.3 }),
				],
			}),
		];

		const result = calcMomentumTimeline(decisions);

		expect(result[0].topMomentum).toBe(0);
		expect(result[0].avgMomentum).toBeCloseTo(-13.33, 2);
	});
});
