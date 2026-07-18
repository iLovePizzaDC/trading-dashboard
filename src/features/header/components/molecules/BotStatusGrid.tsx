import StatCard from '@/features/header/components/atoms/StatCard';
import { getStatusCard, getTradingDayProgress } from '@/features/header/utils/status-card';
import { formatAsBerlinTime, formatNextOpen } from '@/features/header/utils/time-helper';

interface IBotStatusGrid {
  isTradingDay: boolean;
  visible: boolean;
  isRunning: boolean;
  ranToday: boolean;
  rebalanceDaysLeft: number;
  rebalanceNextDate: string;
  rebalancePct: number;
  marketIsOpen: boolean | null;
  nextOpen: string | null;
  nextClose: string | null;
  lastUpdated?: string;
}

function BotStatusGrid({
  isTradingDay,
  visible,
  isRunning,
  ranToday,
  rebalanceDaysLeft,
  rebalanceNextDate,
  rebalancePct,
  marketIsOpen,
  nextOpen,
  nextClose,
  lastUpdated,
}: IBotStatusGrid) {
  const statusCard = getStatusCard(isRunning, ranToday, isTradingDay, nextOpen);
  const daysLeftString =
    rebalanceDaysLeft === 0
      ? 'today'
      : rebalanceDaysLeft === 1
        ? 'tomorrow'
        : `in ${rebalanceDaysLeft}d`;

  return (
    <div className='flex flex-col gap-2 pt-3'>
      <div className='grid grid-cols-1 gap-2 sm:grid-cols-3'>
        <StatCard
          label='Status'
          value={statusCard.value}
          sub={statusCard.sub}
          progress={statusCard.progress}
          color={statusCard.color}
          delay='0ms'
          visible={visible}
          highlight={isRunning}
        />
        <StatCard
          label='Rebalance'
          value={daysLeftString}
          sub={rebalanceNextDate}
          progress={rebalancePct}
          color='green'
          delay='60ms'
          visible={visible}
        />
        <StatCard
          label='Market'
          value={marketIsOpen ? 'open' : 'closed'}
          sub={
            marketIsOpen && nextClose
              ? `closes ${formatAsBerlinTime(nextClose)}`
              : nextOpen
                ? formatNextOpen(nextOpen)
                : '—'
          }
          progress={marketIsOpen ? getTradingDayProgress() : 0}
          color='amber'
          delay='120ms'
          visible={visible}
        />
      </div>

      <p
        className={`
					text-[10px] tracking-wider text-white/15
					transition-all duration-300 ease-out
					${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'}
				`}
        style={{ transitionDelay: visible ? '180ms' : '0ms' }}
      >
        {lastUpdated ? (
          `updated ${lastUpdated}`
        ) : (
          <span
            className='inline-block h-2.5 w-28 animate-pulse rounded bg-white/10'
            data-testid='bot-row-loading-skeleton'
          />
        )}
      </p>
    </div>
  );
}

export default BotStatusGrid;
