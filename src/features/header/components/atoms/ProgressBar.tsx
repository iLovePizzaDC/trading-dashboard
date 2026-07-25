import { PROGRESS_COLOR_MAP } from '@/features/header/constants/progress-bar';
import type { ProgressBarColor } from '@/features/header/types/progress-bar';

interface IProgressBar {
	value: number;
	color?: ProgressBarColor;
	animationDelay?: string;
}

function ProgressBar({ value, color = 'green', animationDelay = '0ms' }: IProgressBar) {
	const clamped = Math.min(100, Math.max(0, value));

	return (
		<div
			className='h-px w-full overflow-hidden rounded-full bg-white/[0.07]'
			data-testid='progress-bar'
		>
			<div
				className={`h-full rounded-full transition-[width] duration-700 ease-out ${PROGRESS_COLOR_MAP[color]}`}
				style={{ width: `${clamped}%`, transitionDelay: animationDelay }}
				data-testid='progress-bar-fill'
			/>
		</div>
	);
}

export default ProgressBar;
