import '@/app/index.css';
import DecisionsCard from '@/features/decisions/components/organisms/DecisionCard';
import EquityCard from '@/features/equity/components/organisms/EquityCard';
import PositionsCard from '@/features/positions/components/organisms/PositionsCard';
import StopHistoryCard from '@/features/stops/components/organisms/StopHistorycard';
import MetricCard from '@/features/summary/components/organisms/MetricCard';
import TradesCard from '@/features/trades/components/organisms/TradesCard';

// TODO reorganize architecture. skeleton und error von organisms sind meistens in molecules!!
function App() {
	return (
		<main className='min-h-screen p-4 md:p-8'>
			<div className='mx-auto max-w-6xl space-y-4'>
				<MetricCard />
				<div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
					<div className='md:col-span-2'>
						<EquityCard />
					</div>
					<PositionsCard />
				</div>
				<div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
					<TradesCard />
					<DecisionsCard />
					<StopHistoryCard />
				</div>
			</div>
		</main>
	);
}

export default App;
