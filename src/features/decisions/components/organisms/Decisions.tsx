import DecisionHistory from '@/features/decisions/components/molecules/DecisionHistory';
import DecisionsCard from '@/features/decisions/components/molecules/DecisionsCard';
import DecisionsError from '@/features/decisions/components/molecules/DecisionsError';
import DecisionsSkeleton from '@/features/decisions/components/molecules/DecisionsSkeleton';
import { fetchDecisions } from '@/shared/api/data';
import { useFetch } from '@/shared/hooks/useFetch';

function Decisions() {
	const { data, loading, error } = useFetch(fetchDecisions);

	if (loading) return <DecisionsSkeleton />;
	if (error || !data) return <DecisionsError />;

	return (
		<div className='grid grid-cols-1 gap-6 md:grid-cols-2 items-start'>
			<DecisionsCard data={data} />
			<DecisionHistory data={data} />
		</div>
	);
}

export default Decisions;
