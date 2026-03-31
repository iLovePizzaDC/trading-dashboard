import EquityChart from '@/features/equity/components/molecules/EquityChart';
import EquityChartError from '@/features/equity/components/molecules/EquityChartError';
import EquityChartSkeleton from '@/features/equity/components/molecules/EquityChartSkeleton';
import { fetchEquity } from '@/shared/api/data';
import { useFetch } from '@/shared/hooks/useFetch';

function EquityCard() {
	const { data, loading, error } = useFetch(fetchEquity);

	if (loading) return <EquityChartSkeleton />;
	if (error || !data) return <EquityChartError />;

	return <EquityChart data={data} />;
}

export default EquityCard;
