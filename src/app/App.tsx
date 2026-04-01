import '@/app/index.css';
import Decisions from '@/features/decisions/components/organisms/Decisions';
import Equity from '@/features/equity/components/organisms/Equity';
import Positions from '@/features/positions/components/organisms/Positions';
import StopHistory from '@/features/stops/components/organisms/StopHistory';
import Summary from '@/features/summary/components/organisms/Summary';
import Trades from '@/features/trades/components/organisms/Trades';

function App() {
	return (
		<main className='min-h-screen p-4 md:p-8'>
			<div className='mx-auto max-w-7xl space-y-4'>
				<Summary />
				<Equity />
				<div className='grid grid-cols-1 gap-4 md:grid-cols-2 items-start'>
					<Positions />
					<Decisions />
					<Trades />
					<StopHistory />
				</div>
			</div>
		</main>
	);
}

export default App;
