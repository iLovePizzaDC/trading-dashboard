import ScrollableGroupList from '@/shared/components/layouts/ScrollableGroupList';
import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

type Group = { symbol: string; label: string };

function renderGroup(group: Group) {
	return <div data-testid='group'>{group.label}</div>;
}

function buildGroups(count: number): Group[] {
	return Array.from({ length: count }, (_, i) => ({ symbol: `SYM${i}`, label: `Group ${i}` }));
}

let instances: MockResizeObserver[] = [];

class MockResizeObserver {
	callback: ResizeObserverCallback;
	observe = vi.fn();
	unobserve = vi.fn();
	disconnect = vi.fn();

	constructor(callback: ResizeObserverCallback) {
		this.callback = callback;
		instances.push(this);
	}
}

describe('<ScrollableGroupList />', () => {
	beforeEach(() => {
		instances = [];
		vi.stubGlobal('ResizeObserver', MockResizeObserver);
	});

	afterEach(() => {
		vi.unstubAllGlobals();
		vi.restoreAllMocks();
	});

	it('renders a group for each item using renderGroup', () => {
		render(<ScrollableGroupList groups={buildGroups(3)} renderGroup={renderGroup} />);

		const items = screen.getAllByTestId('group');
		expect(items.map((el) => el.textContent)).toEqual(['Group 0', 'Group 1', 'Group 2']);
	});

	it('renders no groups when the groups array is empty', () => {
		render(<ScrollableGroupList groups={[]} renderGroup={renderGroup} />);

		expect(screen.queryAllByTestId('group')).toHaveLength(0);
	});

	it('renders a divider between groups but not after the last one', () => {
		render(<ScrollableGroupList groups={buildGroups(3)} renderGroup={renderGroup} />);

		expect(screen.getAllByTestId('group-divider')).toHaveLength(2);
	});

	it('renders no divider when there is only a single group', () => {
		render(<ScrollableGroupList groups={buildGroups(1)} renderGroup={renderGroup} />);

		expect(screen.queryAllByTestId('group-divider')).toHaveLength(0);
	});

	it('observes the scroll container with a ResizeObserver', () => {
		render(<ScrollableGroupList groups={buildGroups(3)} renderGroup={renderGroup} />);

		expect(instances).toHaveLength(1);
		expect(instances[0].observe).toHaveBeenCalledTimes(1);
	});

	it('disconnects the ResizeObserver on unmount', () => {
		const { unmount } = render(
			<ScrollableGroupList groups={buildGroups(3)} renderGroup={renderGroup} />,
		);

		unmount();

		expect(instances[0].disconnect).toHaveBeenCalledTimes(1);
	});

	it('does not apply a mask-image fade when content fits (scrollHeight <= clientHeight)', () => {
		vi.spyOn(HTMLElement.prototype, 'scrollHeight', 'get').mockReturnValue(100);
		vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(200);

		render(<ScrollableGroupList groups={buildGroups(3)} renderGroup={renderGroup} />);

		expect(screen.queryByTestId('group-scroll-container')).not.toHaveAttribute(
			'style',
			expect.stringContaining('maskImage'),
		);
	});

	it('applies a mask-image fade when content overflows (scrollHeight > clientHeight)', () => {
		vi.spyOn(HTMLElement.prototype, 'scrollHeight', 'get').mockReturnValue(500);
		vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(200);

		render(<ScrollableGroupList groups={buildGroups(3)} renderGroup={renderGroup} />);

		expect(screen.queryByTestId('group-scroll-container')).toHaveStyle({
			maskImage: 'linear-gradient(to bottom, black calc(100% - 40px), transparent 100%)',
		});
	});

	it('re-checks scroll overflow when the ResizeObserver callback fires', () => {
		const scrollHeightSpy = vi
			.spyOn(HTMLElement.prototype, 'scrollHeight', 'get')
			.mockReturnValue(100);
		vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(200);

		render(<ScrollableGroupList groups={buildGroups(3)} renderGroup={renderGroup} />);

		expect(screen.queryByTestId('group-scroll-container')).not.toHaveAttribute(
			'style',
			expect.stringContaining('maskImage'),
		);

		scrollHeightSpy.mockReturnValue(500);
		instances[0].callback([], instances[0] as unknown as ResizeObserver);

		expect(screen.queryByTestId('group-scroll-container')).toHaveStyle({
			maskImage: 'linear-gradient(to bottom, black calc(100% - 40px), transparent 100%)',
		});
	});

	it('re-checks scroll overflow when the groups prop changes', () => {
		const scrollHeightSpy = vi
			.spyOn(HTMLElement.prototype, 'scrollHeight', 'get')
			.mockReturnValue(100);
		vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(200);

		const { rerender } = render(
			<ScrollableGroupList groups={buildGroups(1)} renderGroup={renderGroup} />,
		);

		expect(screen.queryByTestId('group-scroll-container')).not.toHaveAttribute(
			'style',
			expect.stringContaining('maskImage'),
		);

		scrollHeightSpy.mockReturnValue(500);
		rerender(<ScrollableGroupList groups={buildGroups(5)} renderGroup={renderGroup} />);

		expect(screen.queryByTestId('group-scroll-container')).toHaveStyle({
			maskImage: 'linear-gradient(to bottom, black calc(100% - 40px), transparent 100%)',
		});
	});
});
