import { RANGES, type Range } from '@/shared/constants/date-range';
import { useLocalStorage } from '@/shared/hooks/useLocalStorage';
import { cutoffDate } from '@/shared/utils/date-range';
import { DateTime } from 'luxon';
import { useEffect, useMemo } from 'react';

function getValidRange(range: Range, defaultRange: Range, excludedRanges: Range[]): Range {
	if (!excludedRanges.includes(range)) return range;
	if (!excludedRanges.includes(defaultRange)) return defaultRange;

	return RANGES.find((r) => !excludedRanges.includes(r)) ?? 'ALL';
}

export function useDateRangeFilter<T>(
	key: string,
	data: T[],
	getDate: (item: T) => string,
	defaultRange: Range = '3M',
	excludedRanges: Range[] = [],
) {
	const [storedRange, setStoredRange] = useLocalStorage<Range>(`${key}-range`, defaultRange);

	const range = useMemo(
		() => getValidRange(storedRange, defaultRange, excludedRanges),
		[storedRange, defaultRange, excludedRanges],
	);

	useEffect(() => {
		if (storedRange !== range) {
			setStoredRange(range);
		}
	}, [storedRange, range, setStoredRange]);

	const setRange = (newRange: Range) => {
		if (excludedRanges.includes(newRange)) return;
		setStoredRange(newRange);
	};

	const filteredData = useMemo(() => {
		const cutoff = cutoffDate(range);
		if (!cutoff) return data;

		return data.filter((item) => {
			const dt = DateTime.fromISO(getDate(item)).startOf('day');
			return dt >= cutoff.startOf('day');
		});
	}, [data, range, getDate]);

	return { range, setRange, filteredData };
}
