import StatusDot from '@/features/header/components/atoms/StatusDot';
import { STATUS_DOT_CONFIG } from '@/features/header/constants/status-dot';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('<StatusDot />', () => {
	it('renders the core dot with the "active" color', () => {
		const { container } = render(<StatusDot variant='active' />);

		const core = container.querySelector('.relative.inline-flex');
		expect(core).toHaveClass('bg-green-400');
	});

	it('renders the ring for the "active" variant', () => {
		const { container } = render(<StatusDot variant='active' />);

		const ring = container.querySelector('.absolute.inline-flex');
		expect(ring).toBeInTheDocument();
		expect(ring).toHaveClass('bg-green-400', 'animate-ping');
	});

	it('renders the "running" variant with a white core and its custom ping animation', () => {
		const { container } = render(<StatusDot variant='running' />);

		const core = container.querySelector('.relative.inline-flex');
		const ring = container.querySelector('.absolute.inline-flex');

		expect(core).toHaveClass('bg-white');
		expect(ring).toHaveClass('bg-white');
		expect(ring).toHaveClass('animate-[ping_0.9s_ease-out_infinite]');
	});

	it('renders the "weekend" variant with an amber core and its custom ping animation', () => {
		const { container } = render(<StatusDot variant='weekend' />);

		const core = container.querySelector('.relative.inline-flex');
		const ring = container.querySelector('.absolute.inline-flex');

		expect(core).toHaveClass('bg-amber-400/60');
		expect(ring).toHaveClass('bg-amber-400');
		expect(ring).toHaveClass('animate-[ping_2.8s_ease-out_infinite]');
	});

	it('does not render the ring for the "inactive" variant', () => {
		const { container } = render(<StatusDot variant='inactive' />);

		const ring = container.querySelector('.absolute.inline-flex');
		expect(ring).not.toBeInTheDocument();
	});

	it('still renders the core dot for the "inactive" variant with a dim color', () => {
		const { container } = render(<StatusDot variant='inactive' />);

		const core = container.querySelector('.relative.inline-flex');
		expect(core).toBeInTheDocument();
		expect(core).toHaveClass('bg-white/10');
	});

	it('applies the core color for every variant directly from STATUS_DOT_CONFIG', () => {
		(Object.keys(STATUS_DOT_CONFIG) as Array<keyof typeof STATUS_DOT_CONFIG>).forEach((variant) => {
			const { container, unmount } = render(<StatusDot variant={variant} />);

			const core = container.querySelector('.relative.inline-flex');
			STATUS_DOT_CONFIG[variant].core.split(' ').forEach((cls) => {
				expect(core).toHaveClass(cls);
			});

			unmount();
		});
	});
});
