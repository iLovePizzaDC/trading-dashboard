export interface BotStatus {
	rebalanceDaysLeft: number;
	rebalanceNextDate: string;
	rebalancePct: number;
	isRunning: boolean;
	ranToday: boolean;
	isTradingDay: boolean;
	marketIsOpen: boolean;
}
