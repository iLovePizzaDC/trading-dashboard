import '@/app/index.css';
import EquityCard from '@/features/equity/components/organisms/EquityCard';
import MetricCard from '@/features/summary/components/organisms/MetricCard';

function App() {
	return (
		<main className='min-h-screen p-4 md:p-8'>
			<div className='mx-auto max-w-6xl space-y-4'>
				<MetricCard />
				<EquityCard />
			</div>
		</main>
	);
}

export default App;
