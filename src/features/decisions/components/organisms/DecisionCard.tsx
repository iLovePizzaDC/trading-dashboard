import DecisionsError from '@/features/decisions/components/molecules/DecisionError';
import DecisionRow from '@/features/decisions/components/molecules/DecisionRow';
import DecisionsSkeleton from '@/features/decisions/components/molecules/DecisionSkeleton';
import { fetchDecisions } from '@/shared/api/data';
import { useFetch } from '@/shared/hooks/useFetch';

export default function DecisionsCard() {
	const { data, loading, error } = useFetch(fetchDecisions);

	if (loading) return <DecisionsSkeleton />;
	if (error || !data) return <DecisionsError />;

	const latest = data[data.length - 1];
	if (!latest) return null;

	const sorted = [...latest.candidates].sort((a, b) => (b.momentum ?? 0) - (a.momentum ?? 0));

	return (
		<div className='rounded-xl border border-white/10 bg-white/5 p-4'>
			<div className='mb-3 flex items-baseline justify-between'>
				<p className='text-xs uppercase tracking-wider text-white/40'>last decisions</p>
				<p className='text-xs text-white/30'>{latest.date}</p>
			</div>
			{sorted.map((c) => (
				<DecisionRow key={c.symbol} candidate={c} />
			))}
		</div>
	);
}
