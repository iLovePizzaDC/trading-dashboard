import StatusDot from '@/features/header/components/atoms/StatusDot';
import type { StatusDotVariant } from '@/features/header/types/status-dot';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface IBotNameRow {
	dotVariant: StatusDotVariant;
	expanded: boolean;
	onClick: () => void;
}

function BotNameRow({ dotVariant, expanded, onClick }: IBotNameRow) {
	return (
		<button
			onClick={onClick}
			className='group flex items-center gap-2 transition-opacity duration-200 hover:opacity-70 cursor-pointer'
			aria-expanded={expanded}
		>
			<StatusDot variant={dotVariant} />

			<p className='text-lg uppercase tracking-widest text-white/30 transition-colors duration-200 group-hover:text-white/40'>
				luna — trading bot
			</p>

			<ChevronDownIcon
				className={`
					h-3 w-3 shrink-0 text-white/15 transition-all duration-300 ease-in-out
					group-hover:text-white/25
					${expanded ? 'rotate-180' : 'rotate-0'}
				`}
			/>
		</button>
	);
}

export default BotNameRow;
