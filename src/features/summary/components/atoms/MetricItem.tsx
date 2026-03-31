import type { ReactNode } from 'react';

interface IMetricItem {
	label: string;
	value: ReactNode;
	sub?: string;
	positive?: boolean;
	featured?: boolean;
	large?: boolean;
}

export default function MetricItem({ label, value, sub, positive, featured, large }: IMetricItem) {
	const valueColor =
		positive === undefined ? 'text-foreground' : positive ? 'text-green-700' : 'text-red-700';

	const subColor =
		positive === undefined ? 'text-muted-foreground' : positive ? 'text-green-700' : 'text-red-700';

	return (
		<div
			className={
				featured ? 'rounded-xl border border-gray-500 bg-gray-900 p-4' : 'rounded-lg bg-muted p-4'
			}
		>
			<p className='mb-1.5 text-xs uppercase tracking-wider text-muted-foreground'>{label}</p>
			<p className={`font-medium leading-tight ${large ? 'text-3xl' : 'text-2xl'} ${valueColor}`}>
				{value}
			</p>
			{sub && <p className={`mt-1 text-xs ${subColor}`}>{sub}</p>}
		</div>
	);
}
