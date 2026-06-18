import type { EquityCurveMode } from '@/features/equity/constants/equity';
import type { ChartPoint } from '@/features/equity/types/equity';
import type { Range } from '@/shared/constants/date-range';
import type { DecisionEntry } from '@/shared/types/decisions';
import type { EquityPoint } from '@/shared/types/equity';
import { cutoffDate } from '@/shared/utils/date-range';
import { DateTime } from 'luxon';

export function normalizeToRelative(data: EquityPoint[], relative: boolean): ChartPoint[] {
	if (!data.length) return [];

	const botStart = data[0].equity;
	const spyStart = data.find((d) => d.spy != null)?.spy ?? null;

	return data.map((d) => ({
		date: d.date,
		equity: relative ? (d.equity / botStart) * 100 : d.equity,
		spy: relative && d.spy != null && spyStart != null ? (d.spy / spyStart) * 100 : (d.spy ?? null),
	}));
}

function filterByRange(chartData: ChartPoint[], range: Range): ChartPoint[] {
	const cutoff = cutoffDate(range);
	if (!cutoff) return chartData;

	return chartData.filter((d) => DateTime.fromISO(d.date).startOf('day') >= cutoff.startOf('day'));
}

function rebaseToFilteredStart(
	filtered: ChartPoint[],
	originalData: EquityPoint[],
	relative: boolean,
): ChartPoint[] {
	if (!filtered.length) return [];

	const baseBotValue = filtered[0].equity;
	const baseSpyValue = filtered[0].spy;
	const fallbackBotValue = originalData[0]?.equity ?? 0;
	const fallbackSpyValue = originalData.find((dp) => dp.spy != null)?.spy ?? 0;

	return filtered.map((d) => ({
		...d,
		equity: relative ? d.equity - baseBotValue + 100 : d.equity - baseBotValue + fallbackBotValue,
		spy:
			d.spy != null && baseSpyValue != null
				? relative
					? d.spy - baseSpyValue + 100
					: d.spy - baseSpyValue + fallbackSpyValue
				: null,
	}));
}

export function applyRangeAndMode(
	allChartData: ChartPoint[],
	range: Range,
	curveMode: EquityCurveMode,
	relative: boolean,
	originalData: EquityPoint[],
): ChartPoint[] {
	const filtered = filterByRange(allChartData, range);

	if (curveMode === 'zoom') {
		return filtered;
	}

	return rebaseToFilteredStart(filtered, originalData, relative);
}

export function findRebalanceIndexes(
	chartData: ChartPoint[],
	decisions: DecisionEntry[],
): number[] {
	if (!chartData.length) return [];

	const decisionDateSet = new Set(decisions.map((d) => d.date));

	return chartData
		.map((point, i) => (decisionDateSet.has(point.date) ? i : -1))
		.filter((i) => i !== -1);
}
