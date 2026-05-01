import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface IShowMoreButton {
	toggle: () => void;
	expanded: boolean;
	hiddenCount: number;
}

function ShowMoreButton({ toggle, expanded, hiddenCount }: IShowMoreButton) {
	return (
		<button
			onClick={toggle}
			className='mt-1 flex w-full items-center justify-center gap-1 rounded-lg py-1.5 text-xs text-white/30 transition-colors hover:bg-linear-to-br from-white/5 to-white/0 hover:text-white/60 cursor-pointer'
		>
			<span>{expanded ? 'show less' : `${hiddenCount} more`}</span>
			<ChevronDownIcon
				className={`h-3 w-3 transition-transform duration-200 ${expanded ? 'rotate-180' : 'rotate-0'}`}
			/>
		</button>
	);
}

export default ShowMoreButton;
