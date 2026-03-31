import SummaryCard from '@/features/summary/components/molecules/SummaryCard';
import SummaryCardError from '@/features/summary/components/molecules/SummaryCardError';
import SummaryCardSkeleton from '@/features/summary/components/molecules/SummaryCardSkeleton';
import { fetchSummary } from '@/shared/api/data';
import { useFetch } from '@/shared/hooks/useFetch';

export default function MetricCard() {
	const { data, loading, error } = useFetch(fetchSummary);

	if (loading) return <SummaryCardSkeleton />;
	if (error || !data) return <SummaryCardError />;

	return <SummaryCard data={data} />;
}
