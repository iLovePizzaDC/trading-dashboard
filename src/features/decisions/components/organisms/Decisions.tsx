import DecisionsCard from '@/features/decisions/components/molecules/DecisionCard';
import DecisionsError from '@/features/decisions/components/molecules/DecisionsError';
import DecisionsSkeleton from '@/features/decisions/components/molecules/DecisionsSkeleton';
import { fetchDecisions } from '@/shared/api/data';
import { useFetch } from '@/shared/hooks/useFetch';
import DecisionHistory from '../molecules/DecisionHistory';

function Decisions() {
	const { data, loading, error } = useFetch(fetchDecisions);

	if (loading) return <DecisionsSkeleton />;
	if (error || !data) return <DecisionsError />;

	return (
		<div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
			<DecisionsCard data={data} />
			<DecisionHistory data={data} />
		</div>
	);
}

export default Decisions;
