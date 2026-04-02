import DecisionsCard from '@/features/decisions/components/molecules/DecisionCard';
import DecisionsError from '@/features/decisions/components/molecules/DecisionsError';
import DecisionsSkeleton from '@/features/decisions/components/molecules/DecisionsSkeleton';
import { fetchDecisions } from '@/shared/api/data';
import { useFetch } from '@/shared/hooks/useFetch';

function Decisions() {
	const { data, loading, error } = useFetch(fetchDecisions);

	if (loading) return <DecisionsSkeleton />;
	if (error || !data) return <DecisionsError />;

	return <DecisionsCard data={data} />;
}

export default Decisions;
