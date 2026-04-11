import StatCard from '@/features/header/components/atoms/StatCard';
import { getStatusCard } from '@/features/header/utils/status-card';

interface IBotStatusGrid {
	isWeekday: boolean;
	dayName: string;
	visible: boolean;
	isRunning: boolean;
	ranToday: boolean;
	rebalanceDaysLeft: number;
	rebalanceNextDate: string;
	rebalancePct: number;
	messageDaysLeft: number;
	messageNextDate: string;
	messagePct: number;
	lastUpdated?: string;
}

function BotStatusGrid({
	isWeekday,
	dayName,
	visible,
	isRunning,
	ranToday,
	rebalanceDaysLeft,
	rebalanceNextDate,
	rebalancePct,
	messageDaysLeft,
	messageNextDate,
	messagePct,
	lastUpdated,
}: IBotStatusGrid) {
	const statusCard = getStatusCard(isRunning, ranToday, isWeekday, dayName);

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
					value={`in ${rebalanceDaysLeft}d`}
					sub={rebalanceNextDate}
					progress={rebalancePct}
					color='green'
					delay='60ms'
					visible={visible}
				/>
				<StatCard
					label='Message'
					value={`in ${messageDaysLeft}d`}
					sub={messageNextDate}
					progress={messagePct}
					color='blue'
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
					<span className='inline-block h-2.5 w-28 animate-pulse rounded bg-white/10' />
				)}
			</p>
		</div>
	);
}

export default BotStatusGrid;
