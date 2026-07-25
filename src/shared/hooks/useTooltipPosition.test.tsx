import { act, render } from '@testing-library/react';
import { useRef, useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useTooltipPosition } from '@/shared/hooks/useTooltipPosition';

function Harness({ initialOpen = false }: { initialOpen?: boolean }) {
	const [open, setOpen] = useState(initialOpen);
	const anchorRef = useRef<HTMLSpanElement>(null);
	const popupRef = useRef<HTMLDivElement>(null);
	const position = useTooltipPosition(open, anchorRef, popupRef);

	return (
		<div>
			<span ref={anchorRef}>anchor</span>
			{open && (
				<div ref={popupRef} data-testid='popup'>
					{JSON.stringify(position)}
				</div>
			)}
			<button onClick={() => setOpen((v) => !v)}>toggle</button>
		</div>
	);
}

describe('useTooltipPosition', () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('does not compute a position while closed', () => {
		const { queryByTestId } = render(<Harness />);
		expect(queryByTestId('popup')).not.toBeInTheDocument();
	});

	it('computes a position synchronously once opened', () => {
		vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
			top: 100,
			bottom: 120,
			left: 50,
			right: 150,
			width: 100,
			height: 20,
			x: 50,
			y: 100,
			toJSON: () => {},
		});

		const { getByText, getByTestId } = render(<Harness />);

		act(() => {
			getByText('toggle').click();
		});

		expect(getByTestId('popup').textContent).toContain('"placement":"bottom"');
	});

	it('adds and removes scroll/resize listeners in sync with open', () => {
		const addSpy = vi.spyOn(window, 'addEventListener');
		const removeSpy = vi.spyOn(window, 'removeEventListener');

		const { getByText } = render(<Harness />);
		const toggle = getByText('toggle');

		act(() => {
			toggle.click();
		});

		expect(addSpy).toHaveBeenCalledWith('scroll', expect.any(Function), true);
		expect(addSpy).toHaveBeenCalledWith('resize', expect.any(Function));

		act(() => {
			toggle.click();
		});

		expect(removeSpy).toHaveBeenCalledWith('scroll', expect.any(Function), true);
		expect(removeSpy).toHaveBeenCalledWith('resize', expect.any(Function));
	});
});
