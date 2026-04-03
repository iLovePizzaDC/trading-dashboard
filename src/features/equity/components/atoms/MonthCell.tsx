import type { MonthlyReturn } from '@/features/equity/types/heatmap';

interface IMonthCell {
	entry: MonthlyReturn;
	onClick: () => void;
	selected: boolean;
}

function MonthCell({ entry, onClick, selected }: IMonthCell) {
	function getColor(ret: number): string {
		if (ret >= 8) return 'bg-green-500/50';
		if (ret >= 4) return 'bg-green-500/40';
		if (ret >= 2) return 'bg-green-500/30';
		if (ret >= 0) return 'bg-green-500/20';
		if (ret >= -2) return 'bg-red-500/20';
		if (ret >= -4) return 'bg-red-500/30';
		if (ret >= -8) return 'bg-red-500/40';
		return 'bg-red-500/50';
	}

	const isPositive = entry.return >= 0;

	return (
		<button
			onClick={onClick}
			title={`${entry.year}-${String(entry.month).padStart(2, '0')}: ${
				isPositive ? '+' : ''
			}${entry.return.toFixed(2)}%`}
			className={`
				h-5 w-full rounded-sm
				transition-all duration-200
				${getColor(entry.return)}

				${
					selected
						? `
						scale-105 z-10
						ring-1 ${isPositive ? 'ring-green-400/40' : 'ring-red-400/40'}
						shadow-[0_0_10px_${isPositive ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}]
					`
						: ''
				}

				cursor-pointer
				hover:brightness-125
			`}
		/>
	);
}

export default MonthCell;
