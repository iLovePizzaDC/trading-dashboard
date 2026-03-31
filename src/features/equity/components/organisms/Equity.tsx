import EquityCard from '@/features/equity/components/molecules/EquityCard';
import EquityError from '@/features/equity/components/molecules/EquityError';
import EquitySkeleton from '@/features/equity/components/molecules/EquitySkeleton';
import { fetchEquity } from '@/shared/api/data';
import { useFetch } from '@/shared/hooks/useFetch';

function Equity() {
	const { data, loading, error } = useFetch(fetchEquity);

	if (loading) return <EquitySkeleton />;
	if (error || !data) return <EquityError />;

	return <EquityCard data={data} />;
}

export default Equity;
