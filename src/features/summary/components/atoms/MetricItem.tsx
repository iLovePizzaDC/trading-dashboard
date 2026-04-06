import type { ReactNode } from 'react';

interface IMetricItem {
	label: string;
	value: ReactNode;
	sub?: string;
	positive?: boolean;
	featured?: boolean;
	large?: boolean;
}

function MetricItem({ label, value, sub, positive, featured, large }: IMetricItem) {
	const valueColor =
		positive === undefined ? 'text-white' : positive ? 'text-green-400' : 'text-red-400';

	const subColor =
		positive === undefined ? 'text-white/40' : positive ? 'text-green-300/80' : 'text-red-300/80';

	return (
		<div
			className={`
				group relative rounded-xl border border-white/10
				bg-linear-to-br from-white/5 to-white/0
				p-4 transition-all duration-300 ease-out
				hover:border-white/20
				hover:from-white/[0.07] hover:to-purple-500/3
				${featured ? 'shadow-[0_0_20px_rgba(255,255,255,0.05)]' : ''}
			`}
		>
			<div className='absolute inset-x-0 top-0 h-px rounded-t-xl bg-linear-to-r from-transparent via-white/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100' />

			<p className='mb-1.5 text-xs uppercase tracking-wider text-white/40 transition-colors duration-300 group-hover:text-white/55'>
				{label}
			</p>

			<p
				className={`
					font-medium leading-tight
					${large ? 'text-3xl' : 'text-2xl'}
					${valueColor}
				`}
			>
				{value}
			</p>

			{sub && <p className={`mt-1 text-xs ${subColor}`}>{sub}</p>}
		</div>
	);
}

export default MetricItem;
