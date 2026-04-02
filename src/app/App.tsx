import '@/app/index.css';
import Decisions from '@/features/decisions/components/organisms/Decisions';
import Equity from '@/features/equity/components/organisms/Equity';
import Momentum from '@/features/momentum/components/organisms/Momentum';
import Positions from '@/features/positions/components/organisms/Positions';
import Stops from '@/features/stops/components/organisms/Stops';
import Summary from '@/features/summary/components/organisms/Summary';
import Trades from '@/features/trades/components/organisms/Trades';

function App() {
	return (
		<main className='min-h-screen p-4 md:p-8 cursor-default'>
			<div className='mx-auto max-w-7xl space-y-6'>
				<Summary />
				<Equity />
				<Trades />
				<div className='grid grid-cols-1 gap-4 md:grid-cols-2 items-start'>
					<Positions />
					<Decisions />
					<Stops />
				</div>
				<Momentum />
			</div>
		</main>
	);
}

export default App;
