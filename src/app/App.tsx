import '@/app/index.css';
import Decisions from '@/features/decisions/components/organisms/Decisions';
import Equity from '@/features/equity/components/organisms/Equity';
import Header from '@/features/header/components/organisms/Header';
import Momentum from '@/features/momentum/components/organisms/Momentum';
import Positions from '@/features/positions/components/organisms/Positions';
import Sector from '@/features/sector/components/organisms/Sector';
import Stops from '@/features/stops/components/organisms/Stops';
import Summary from '@/features/summary/components/organisms/Summary';
import Trades from '@/features/trades/components/organisms/Trades';
import { DataVersionProvider } from '@/shared/context/DataVersionProvider';

function App() {
  return (
    <DataVersionProvider>
      <main className='min-h-screen p-4 sm:pb-10 md:p-5 cursor-default'>
        <div className='mx-auto max-w-7xl space-y-6'>
          <Header />
          <Summary />
          <Equity />
          <Trades />
          <Decisions />
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-2 items-start'>
            <Positions />
            <Stops />
            <div className='md:col-span-2 xl:col-span-2'>
              <Sector />
            </div>
          </div>
          <Momentum />
        </div>
      </main>
    </DataVersionProvider>
  );
}

export default App;
