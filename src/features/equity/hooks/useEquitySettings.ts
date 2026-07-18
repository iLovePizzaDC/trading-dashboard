import type { EquityCurveMode } from '@/features/equity/constants/equity';
import { RANGES, type Range } from '@/shared/constants/date-range';
import { useFilterWithStorage } from '@/shared/hooks/useFilterWithStorage';
import { useLocalStorage } from '@/shared/hooks/useLocalStorage';
import type { EquityPoint } from '@/shared/types/equity';
import { cutoffDate } from '@/shared/utils/date-range';
import { DateTime } from 'luxon';
import { useState } from 'react';

export function useEquitySettings(data: EquityPoint[]) {
  const [showSpy, setShowSpy] = useLocalStorage<boolean>('equity-curve-spy', true);
  const [relative, setRelative] = useLocalStorage<boolean>('equity-curve-relative', true);
  const [curveMode, setCurveMode] = useLocalStorage<EquityCurveMode>('equity-curve-mode', 'zoom');
  const [hoveredValue, setHoveredValue] = useState<number | null>(null);

  const { value: range, setValue: setRange } = useFilterWithStorage<EquityPoint, Range>({
    storageKey: 'equity-curve-range',
    data,
    defaultValue: '3M',
    allValues: RANGES,
    filterFn: (d, range) => {
      const cutoff = cutoffDate(range);
      if (!cutoff) return true;
      return DateTime.fromISO(d.date).startOf('day') >= cutoff.startOf('day');
    },
  });

  return {
    showSpy,
    setShowSpy,
    relative,
    setRelative,
    curveMode,
    setCurveMode,
    hoveredValue,
    setHoveredValue,
    range,
    setRange,
  };
}
