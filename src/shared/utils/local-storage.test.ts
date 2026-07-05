import {
	getLocalStorageItem,
	getValidKey,
	removeLocalStorageItem,
	setLocalStorageItem,
} from '@/shared/utils/local-storage';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('getValidKey', () => {
	const allKeys = ['1M', '3M', '6M', 'YTD', 'ALL'] as const;

	it('returns current when it is not excluded', () => {
		expect(getValidKey('3M', '1M', allKeys, [])).toBe('3M');
	});

	it('falls back to defaultKey when current is excluded', () => {
		expect(getValidKey('3M', '1M', allKeys, ['3M'])).toBe('1M');
	});

	it('falls back to the first non-excluded key in allKeys when both current and defaultKey are excluded', () => {
		expect(getValidKey('3M', '1M', allKeys, ['3M', '1M'])).toBe('6M');
	});

	it('returns defaultKey as a last resort when every key in allKeys is excluded', () => {
		expect(getValidKey('3M', '1M', allKeys, [...allKeys])).toBe('1M');
	});

	it('returns current when excluded is empty', () => {
		expect(getValidKey('YTD', '1M', allKeys, [])).toBe('YTD');
	});

	it('respects the order of allKeys when finding the first non-excluded fallback', () => {
		expect(getValidKey('1M', '1M', allKeys, ['1M', '3M', '6M'])).toBe('YTD');
	});
});

describe('getLocalStorageItem', () => {
	beforeEach(() => {
		window.localStorage.clear();
		vi.spyOn(console, 'warn').mockImplementation(() => {});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('returns the fallback when the key does not exist', () => {
		expect(getLocalStorageItem('missing-key', 'fallback')).toBe('fallback');
	});

	it('returns the parsed value when the key exists', () => {
		window.localStorage.setItem('my-key', JSON.stringify({ a: 1 }));

		expect(getLocalStorageItem('my-key', null)).toEqual({ a: 1 });
	});

	it('returns a parsed primitive value correctly', () => {
		window.localStorage.setItem('bool-key', JSON.stringify(true));

		expect(getLocalStorageItem('bool-key', false)).toBe(true);
	});

	it('returns the fallback and warns when the stored value is invalid JSON', () => {
		window.localStorage.setItem('bad-key', '{not valid json');

		const result = getLocalStorageItem('bad-key', 'fallback');

		expect(result).toBe('fallback');
		expect(console.warn).toHaveBeenCalledWith(
			expect.stringContaining('bad-key'),
			expect.anything(),
		);
	});

	it('returns the fallback and warns when localStorage.getItem throws', () => {
		vi.spyOn(window.localStorage, 'getItem').mockImplementation(() => {
			throw new Error('access denied');
		});

		const result = getLocalStorageItem('any-key', 'fallback');

		expect(result).toBe('fallback');
		expect(console.warn).toHaveBeenCalled(); // TODO failed
	});

	it('returns the fallback when window is undefined (SSR)', () => {
		vi.stubGlobal('window', undefined);

		expect(getLocalStorageItem('any-key', 'fallback')).toBe('fallback');

		vi.unstubAllGlobals();
	});
});

describe('setLocalStorageItem', () => {
	beforeEach(() => {
		window.localStorage.clear();
		vi.spyOn(console, 'warn').mockImplementation(() => {});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('stores a JSON-stringified value under the given key', () => {
		setLocalStorageItem('my-key', { a: 1 });

		expect(window.localStorage.getItem('my-key')).toBe(JSON.stringify({ a: 1 }));
	});

	it('overwrites an existing value for the same key', () => {
		setLocalStorageItem('my-key', 'first');
		setLocalStorageItem('my-key', 'second');

		expect(window.localStorage.getItem('my-key')).toBe(JSON.stringify('second'));
	});

	it('warns and does not throw when localStorage.setItem throws', () => {
		vi.spyOn(window.localStorage, 'setItem').mockImplementation(() => {
			throw new Error('quota exceeded');
		});

		expect(() => setLocalStorageItem('any-key', 'value')).not.toThrow();
		expect(console.warn).toHaveBeenCalled(); // TODO failed
	});

	it('does nothing when window is undefined (SSR)', () => {
		vi.stubGlobal('window', undefined);

		expect(() => setLocalStorageItem('any-key', 'value')).not.toThrow();

		vi.unstubAllGlobals();
	});
});

describe('removeLocalStorageItem', () => {
	beforeEach(() => {
		window.localStorage.clear();
		vi.spyOn(console, 'warn').mockImplementation(() => {});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('removes an existing key', () => {
		window.localStorage.setItem('my-key', JSON.stringify('value'));

		removeLocalStorageItem('my-key');

		expect(window.localStorage.getItem('my-key')).toBeNull();
	});

	it('does not throw when removing a key that does not exist', () => {
		expect(() => removeLocalStorageItem('missing-key')).not.toThrow();
	});

	it('warns and does not throw when localStorage.removeItem throws', () => {
		vi.spyOn(window.localStorage, 'removeItem').mockImplementation(() => {
			throw new Error('access denied');
		});

		expect(() => removeLocalStorageItem('any-key')).not.toThrow();
		expect(console.warn).toHaveBeenCalled(); // TODO failed
	});

	it('does nothing when window is undefined (SSR)', () => {
		vi.stubGlobal('window', undefined);

		expect(() => removeLocalStorageItem('any-key')).not.toThrow();

		vi.unstubAllGlobals();
	});
});
