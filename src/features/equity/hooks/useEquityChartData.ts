import type { EquityCurveMode } from '@/features/equity/constants/equity';
import {
  applyRangeAndMode,
  findRebalanceIndexes,
  normalizeToRelative,
} from '@/features/equity/utils/equity-curve';
import type { Range } from '@/shared/constants/date-range';
import type { DecisionEntry } from '@/shared/types/decisions';
import type { EquityPoint } from '@/shared/types/equity';
import { useMemo } from 'react';

export function useEquityChartData(
  data: EquityPoint[],
  decisions: DecisionEntry[],
  relative: boolean,
  curveMode: EquityCurveMode,
  range: Range,
) {
  const allChartData = useMemo(() => normalizeToRelative(data, relative), [data, relative]);

  const chartData = useMemo(
    () => applyRangeAndMode(allChartData, range, curveMode, relative, data),
    [allChartData, range, curveMode, relative, data],
  );

  const rebalanceIndexes = useMemo(
    () => findRebalanceIndexes(chartData, decisions),
    [chartData, decisions],
  );

  return {
    chartData,
    rebalanceIndexes,
  };
}
