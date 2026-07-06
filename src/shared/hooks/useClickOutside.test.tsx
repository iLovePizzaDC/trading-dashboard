import { useClickOutside } from '@/shared/hooks/useClickOutside';
import { fireEvent, render } from '@testing-library/react';
import { createRef, useRef } from 'react';
import { describe, expect, it, vi } from 'vitest';

function TestComponent({
	onOutsideClick,
	useMultipleRefs = false,
}: {
	onOutsideClick: () => void;
	useMultipleRefs?: boolean;
}) {
	const ref1 = useRef<HTMLDivElement>(null);
	const ref2 = useRef<HTMLDivElement>(null);

	useClickOutside(useMultipleRefs ? [ref1, ref2] : ref1, onOutsideClick);

	return (
		<div>
			<div data-testid='inside-1' ref={ref1}>
				Inside 1
			</div>
			<div data-testid='inside-2' ref={ref2}>
				Inside 2
			</div>
			<div data-testid='outside'>Outside</div>
		</div>
	);
}

describe('useClickOutside', () => {
	it('calls onOutsideClick when clicking outside the target ref', () => {
		const onOutsideClick = vi.fn();

		const { getByTestId } = render(<TestComponent onOutsideClick={onOutsideClick} />);

		fireEvent.mouseDown(getByTestId('outside'));

		expect(onOutsideClick).toHaveBeenCalledTimes(1);
	});

	it('does not call onOutsideClick when clicking inside the target ref', () => {
		const onOutsideClick = vi.fn();

		const { getByTestId } = render(<TestComponent onOutsideClick={onOutsideClick} />);

		fireEvent.mouseDown(getByTestId('inside-1'));

		expect(onOutsideClick).not.toHaveBeenCalled();
	});

	it('does not call onOutsideClick when clicking on a nested child of the target ref', () => {
		const onOutsideClick = vi.fn();
		const ref = createRef<HTMLDivElement>();

		function NestedComponent() {
			useClickOutside(ref, onOutsideClick);

			return (
				<div ref={ref} data-testid='parent'>
					<span data-testid='child'>Nested</span>
				</div>
			);
		}

		const { getByTestId } = render(<NestedComponent />);

		fireEvent.mouseDown(getByTestId('child'));

		expect(onOutsideClick).not.toHaveBeenCalled();
	});

	it('supports an array of refs, treating a click inside any of them as "inside"', () => {
		const onOutsideClick = vi.fn();

		const { getByTestId } = render(
			<TestComponent onOutsideClick={onOutsideClick} useMultipleRefs />,
		);

		fireEvent.mouseDown(getByTestId('inside-1'));
		fireEvent.mouseDown(getByTestId('inside-2'));

		expect(onOutsideClick).not.toHaveBeenCalled();
	});

	it('calls onOutsideClick when clicking outside all refs in an array', () => {
		const onOutsideClick = vi.fn();

		const { getByTestId } = render(
			<TestComponent onOutsideClick={onOutsideClick} useMultipleRefs />,
		);

		fireEvent.mouseDown(getByTestId('outside'));

		expect(onOutsideClick).toHaveBeenCalledTimes(1);
	});

	it('does not throw and treats the click as outside when ref.current is null', () => {
		const onOutsideClick = vi.fn();
		const ref = createRef<HTMLDivElement>();

		function UnmountedRefComponent() {
			useClickOutside(ref, onOutsideClick);
			return <div data-testid='outside'>No ref attached</div>;
		}

		const { getByTestId } = render(<UnmountedRefComponent />);

		expect(() => fireEvent.mouseDown(getByTestId('outside'))).not.toThrow();
		expect(onOutsideClick).toHaveBeenCalledTimes(1);
	});

	it('removes the event listener on unmount', () => {
		const onOutsideClick = vi.fn();
		const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

		const { unmount } = render(<TestComponent onOutsideClick={onOutsideClick} />);

		unmount();

		expect(removeEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));

		removeEventListenerSpy.mockRestore();
	});

	it('does not call onOutsideClick after unmount', () => {
		const onOutsideClick = vi.fn();

		const { unmount } = render(<TestComponent onOutsideClick={onOutsideClick} />);

		unmount();

		fireEvent.mouseDown(document.body);

		expect(onOutsideClick).not.toHaveBeenCalled();
	});

	it('re-attaches the listener when onOutsideClick changes', () => {
		const firstCallback = vi.fn();
		const secondCallback = vi.fn();

		function RerenderComponent({ callback }: { callback: () => void }) {
			const ref = useRef<HTMLDivElement>(null);
			useClickOutside(ref, callback);
			return (
				<div>
					<div ref={ref} data-testid='inside'>
						Inside
					</div>
					<div data-testid='outside'>Outside</div>
				</div>
			);
		}

		const { getByTestId, rerender } = render(<RerenderComponent callback={firstCallback} />);

		rerender(<RerenderComponent callback={secondCallback} />);

		fireEvent.mouseDown(getByTestId('outside'));

		expect(firstCallback).not.toHaveBeenCalled();
		expect(secondCallback).toHaveBeenCalledTimes(1);
	});
});
