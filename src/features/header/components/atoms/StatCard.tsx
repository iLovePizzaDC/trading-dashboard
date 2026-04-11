import ProgressBar from '@/features/header/components/atoms/Progressbar';
import type { ProgressBarColor } from '@/features/header/types/progress-bar';

interface IStatCard {
	label: string;
	value: string;
	sub: string;
	progress: number;
	color?: ProgressBarColor;
	delay?: string;
	visible?: boolean;
}

function StatCard({
	label,
	value,
	sub,
	progress,
	color = 'green',
	delay = '0ms',
	visible = false,
}: IStatCard) {
	return (
		<div
			className={`
				group relative flex flex-col gap-2 rounded-lg border border-white/6 bg-white/3
				px-3 py-2.5 cursor-default
				transition-all duration-300 ease-out
				hover:border-white/12
				${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1.5'}
			`}
			style={{ transitionDelay: visible ? delay : '0ms' }}
		>
			<span className='text-[10px] uppercase tracking-[0.14em] text-white/20 transition-colors duration-200 group-hover:text-white/30'>
				{label}
			</span>

			<span className='text-[13px] font-medium leading-none text-white/60 transition-colors duration-200 group-hover:text-white/80'>
				{value}
			</span>

			<span className='text-[10px] leading-none text-white/15 transition-colors duration-200 group-hover:text-white/25'>
				{sub}
			</span>

			<ProgressBar value={progress} color={color} animationDelay={visible ? delay : '0ms'} />
		</div>
	);
}

export default StatCard;
