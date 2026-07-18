import ProgressBar from '@/features/header/components/atoms/ProgressBar';
import type { ProgressBarColor } from '@/features/header/types/progress-bar';

interface IStatCard {
  label: string;
  value: string;
  sub: string;
  progress: number;
  color?: ProgressBarColor;
  delay?: string;
  visible?: boolean;
  highlight?: boolean;
}

function StatCard({
  label,
  value,
  sub,
  progress,
  color = 'green',
  delay = '0ms',
  visible = false,
  highlight = false,
}: IStatCard) {
  return (
    <div
      className={`
				group relative flex flex-col gap-2 rounded-lg border px-3 py-2.5 cursor-default
				transition-all duration-300 ease-out
				${highlight
          ? 'border-white/20 bg-white/6 animate-[pulse_2s_ease-in-out_infinite]'
          : 'border-white/6 bg-white/3 hover:border-white/12'
        }
				${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1.5'}
			`}
      style={{ transitionDelay: visible ? delay : '0ms' }}
    >
      <span
        className={`text-[10px] uppercase tracking-[0.14em] transition-colors duration-200 ${highlight ? 'text-white/40' : 'text-white/20 group-hover:text-white/30'}`}
      >
        {label}
      </span>

      <span
        className={`text-[13px] font-medium leading-none transition-colors duration-200 ${highlight ? 'text-white/90' : 'text-white/60 group-hover:text-white/80'}`}
      >
        {value}
      </span>

      <span
        className={`text-[10px] leading-none transition-colors duration-200 ${highlight ? 'text-white/30' : 'text-white/15 group-hover:text-white/25'}`}
      >
        {sub}
      </span>

      <ProgressBar value={progress} color={color} animationDelay={visible ? delay : '0ms'} />
    </div>
  );
}

export default StatCard;
