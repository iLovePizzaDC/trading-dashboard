import EquityCurve from '@/features/equity/components/molecules/EquityCurve';
import EquityError from '@/features/equity/components/molecules/EquityError';
import EquitySkeleton from '@/features/equity/components/molecules/EquitySkeleton';
import MonthlyHeatmap from '@/features/equity/components/molecules/MonthlyHeatMap';
import { fetchEquity } from '@/shared/api/data';
import { useFetch } from '@/shared/hooks/useFetch';

function Equity() {
	const { data, loading, error } = useFetch(fetchEquity);

	if (loading) return <EquitySkeleton />;
	if (error || !data) return <EquityError />;

	return (
		<div className='grid grid-cols-1 gap-4 lg:grid-cols-[3fr_2fr] items-start'>
			<EquityCurve data={data} />
			<MonthlyHeatmap data={data} />
		</div>
	);
}

export default Equity;
