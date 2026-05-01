import {
	getLocalStorageItem,
	removeLocalStorageItem,
	setLocalStorageItem,
} from '@/shared/utils/local-storage';
import { useEffect, useState } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
	const [value, setValue] = useState<T>(() => getLocalStorageItem(key, initialValue));

	useEffect(() => {
		setLocalStorageItem(key, value);
	}, [key, value]);

	const setStoredValue = (newValue: T | ((prev: T) => T)) => {
		setValue((prev) => (newValue instanceof Function ? newValue(prev) : newValue));
	};

	const remove = () => {
		removeLocalStorageItem(key);
		setValue(initialValue);
	};

	return [value, setStoredValue, remove] as const;
}
