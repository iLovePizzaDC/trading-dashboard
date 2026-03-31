import '@/app/index.css';
import EquityCard from '@/features/equity/components/organisms/EquityCard';
import OpenPositions from '@/features/positions/components/organisms/OpenPositions';
import MetricCard from '@/features/summary/components/organisms/MetricCard';

function App() {
	return (
		<main className='min-h-screen p-4 md:p-8'>
			<div className='mx-auto max-w-6xl space-y-4'>
				<MetricCard />
				<div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
					<div className='md:col-span-2'>
						<EquityCard />
					</div>
					<OpenPositions />
				</div>
			</div>
		</main>
	);
}

export default App;
