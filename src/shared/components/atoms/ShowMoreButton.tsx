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
			className='mt-2 flex w-full items-center justify-center gap-1 rounded-lg py-2 text-xs text-white/30 transition-colors hover:bg-white/5 hover:text-white/60 cursor-pointer'
		>
			<span>{expanded ? 'show less' : `${hiddenCount} more`}</span>
			<ChevronDownIcon
				className='h-3 w-3 transition-transform duration-300'
				style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
			/>
		</button>
	);
}

export default ShowMoreButton;
