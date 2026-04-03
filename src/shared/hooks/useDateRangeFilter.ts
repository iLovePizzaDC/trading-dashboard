import type { Range } from '@/shared/constants/date-range';
import { cutoffDate } from '@/shared/utils/date-range';
import { useMemo, useState } from 'react';

export function useDateRangeFilter<T>(data: T[], getDate: (item: T) => string) {
	const [range, setRange] = useState<Range>('3M');

	const filteredData = useMemo(() => {
		const cutoff = cutoffDate(range);
		if (!cutoff) return data;

		return data.filter((item) => new Date(getDate(item)) >= cutoff);
	}, [data, range, getDate]);

	return { range, setRange, filteredData };
}
