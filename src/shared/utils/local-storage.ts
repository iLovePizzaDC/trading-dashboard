export function getLocalStorageItem<T>(key: string, fallback: T): T {
	if (typeof window === 'undefined') return fallback;

	try {
		const item = window.localStorage.getItem(key);
		return item ? (JSON.parse(item) as T) : fallback;
	} catch (error) {
		console.warn(`Error reading localStorage key "${key}"`, error);
		return fallback;
	}
}

export function setLocalStorageItem<T>(key: string, value: T): void {
	if (typeof window === 'undefined') return;

	try {
		window.localStorage.setItem(key, JSON.stringify(value));
	} catch (error) {
		console.warn(`Error setting localStorage key "${key}"`, error);
	}
}

export function removeLocalStorageItem(key: string): void {
	if (typeof window === 'undefined') return;

	try {
		window.localStorage.removeItem(key);
	} catch (error) {
		console.warn(`Error removing localStorage key "${key}"`, error);
	}
}
