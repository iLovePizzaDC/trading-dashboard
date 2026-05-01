import { useLocalStorage } from '@/shared/hooks/useLocalStorage';
import { getValidKey } from '@/shared/utils/local-storage';
import { useEffect, useMemo } from 'react';

export function useFilterWithStorage<T, K extends string>({
	storageKey,
	data,
	defaultValue,
	allValues,
	excludedValues = [],
	filterFn,
}: {
	storageKey: string;
	data: T[];
	defaultValue: K;
	allValues: readonly K[];
	excludedValues?: K[];
	filterFn?: (item: T, value: K) => boolean;
}) {
	const [storedValue, setStoredValue] = useLocalStorage<K>(storageKey, defaultValue);

	const value = useMemo(
		() => getValidKey(storedValue, defaultValue, allValues, excludedValues),
		[storedValue, defaultValue, allValues, excludedValues],
	);

	useEffect(() => {
		if (storedValue !== value) {
			setStoredValue(value);
		}
	}, [storedValue, value, setStoredValue]);

	const setValue = (newValue: K) => {
		if (excludedValues.includes(newValue)) return;
		setStoredValue(newValue);
	};

	const filteredData = useMemo(() => {
		if (!filterFn) return data;
		return data.filter((item) => filterFn(item, value));
	}, [data, value, filterFn]);

	return { value, setValue, filteredData };
}
