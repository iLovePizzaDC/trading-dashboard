import EquityCurve from '@/features/equity/components/molecules/EquityCurve';
import EquityError from '@/features/equity/components/molecules/EquityError';
import EquitySkeleton from '@/features/equity/components/molecules/EquitySkeleton';
import MonthlyHeatmap from '@/features/equity/components/molecules/MonthlyHeatMap';
import { fetchBotEquity, fetchSpyEquity } from '@/shared/api/data';
import { useFetch } from '@/shared/hooks/useFetch';

function Equity() {
	const {
		data: botEquity,
		loading: botEquityLoading,
		error: botEquityError,
	} = useFetch(fetchBotEquity);

	const {
		data: spyEquity,
		loading: spyEquityLoading,
		error: spyEquityError,
	} = useFetch(fetchSpyEquity);

	if (botEquityLoading || spyEquityLoading) return <EquitySkeleton />;
	if (botEquityError || !botEquity || spyEquityError || !spyEquity) return <EquityError />;

	const mergedData = botEquity.map((point) => {
		const spyPoint = spyEquity.find((s) => s.date === point.date);

		return {
			...point,
			spy: spyPoint?.equity ?? null,
		};
	});

	return (
		<div className='grid grid-cols-1 gap-4 lg:grid-cols-[3fr_2fr] items-start'>
			<EquityCurve data={mergedData} />
			<MonthlyHeatmap data={botEquity} />
		</div>
	);
}

export default Equity;
