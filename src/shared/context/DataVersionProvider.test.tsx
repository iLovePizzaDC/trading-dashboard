import { DataVersionContext } from '@/shared/context/DataVersionContext';
import { DataVersionProvider } from '@/shared/context/DataVersionProvider';
import { useDataVersion } from '@/shared/hooks/useDataVersion';
import { render, screen } from '@testing-library/react';
import { useContext } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/shared/hooks/useDataVersion', () => ({
	useDataVersion: vi.fn(),
}));

function Consumer() {
	const version = useContext(DataVersionContext);
	return <p data-testid='version'>{version ?? 'null'}</p>;
}

describe('<DataVersionProvider />', () => {
	beforeEach(() => {
		vi.mocked(useDataVersion).mockReset();
	});

	it('provides the value returned by useDataVersion to consumers', () => {
		vi.mocked(useDataVersion).mockReturnValue('v1');

		render(
			<DataVersionProvider>
				<Consumer />
			</DataVersionProvider>,
		);

		expect(screen.getByTestId('version')).toHaveTextContent('v1');
	});

	it('provides null to consumers when useDataVersion returns null', () => {
		vi.mocked(useDataVersion).mockReturnValue(null);

		render(
			<DataVersionProvider>
				<Consumer />
			</DataVersionProvider>,
		);

		expect(screen.getByTestId('version')).toHaveTextContent('null');
	});

	it('renders its children', () => {
		vi.mocked(useDataVersion).mockReturnValue('v1');

		render(
			<DataVersionProvider>
				<p>child content</p>
			</DataVersionProvider>,
		);

		expect(screen.getByText('child content')).toBeInTheDocument();
	});

	it('renders multiple children', () => {
		vi.mocked(useDataVersion).mockReturnValue('v1');

		render(
			<DataVersionProvider>
				<p>first</p>
				<p>second</p>
			</DataVersionProvider>,
		);

		expect(screen.getByText('first')).toBeInTheDocument();
		expect(screen.getByText('second')).toBeInTheDocument();
	});
});
