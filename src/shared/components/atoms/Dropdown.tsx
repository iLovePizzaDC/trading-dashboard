import type { DropdownItem } from '@/shared/constants/dropdown';
import { useClickOutside } from '@/shared/hooks/useClickOutside';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { useRef, useState } from 'react';

interface IDropdown {
	trigger: React.ReactNode;
	items: DropdownItem[];
	width?: 'w-32' | 'w-36';
}

function Dropdown({ trigger, items, width = 'w-36' }: IDropdown) {
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	useClickOutside(ref, () => {
		setOpen(false);
	});

	return (
		<div className='relative' ref={ref}>
			<button
				onClick={() => setOpen((v) => !v)}
				className='flex items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-1.5 text-[10px] text-white/30 transition-colors hover:border-white/20 hover:text-white/50 cursor-pointer'
			>
				{trigger}
				<ChevronDownIcon
					className='h-3 w-3 transition-transform duration-200'
					style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
					data-testid='dropdown-chevron'
				/>
			</button>

			{open && (
				<div
					className={`absolute right-0 top-full z-50 mt-1.5 ${width} overflow-hidden rounded-xl border border-white/10 bg-[#1f2028] shadow-xl`}
					data-testid='dropdown-menu'
				>
					{items.map(({ key, label, icon, active, onClick }) => (
						<button
							key={key}
							onClick={() => {
								onClick();
								setOpen(false);
							}}
							className={`flex w-full items-center gap-2.5 px-3 py-2 text-xs transition-colors hover:bg-white/5 cursor-pointer ${
								active ? 'text-white/70' : 'text-white/40 hover:text-white/70'
							}`}
						>
							{icon}
							{label}
						</button>
					))}
				</div>
			)}
		</div>
	);
}

export default Dropdown;
