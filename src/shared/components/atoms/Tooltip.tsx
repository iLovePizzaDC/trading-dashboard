import { useClickOutside } from '@/shared/hooks/useClickOutside';
import { useTooltipPosition } from '@/shared/hooks/useTooltipPosition';
import { useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface ITooltip {
	content: ReactNode;
	children: ReactNode;
	className?: string;
}

function Tooltip({ content, children, className = '' }: ITooltip) {
	const [open, setOpen] = useState(false);
	const anchorRef = useRef<HTMLSpanElement>(null);
	const popupRef = useRef<HTMLDivElement>(null);

	const position = useTooltipPosition(open, anchorRef, popupRef);

	useClickOutside([anchorRef, popupRef], () => {
		setOpen(false);
	});

	return (
		<span ref={anchorRef} className={`relative ${className}`}>
			<span
				role='button'
				tabIndex={0}
				onClick={(e) => {
					e.stopPropagation();
					setOpen((v) => !v);
				}}
				onKeyDown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						e.stopPropagation();
						e.preventDefault();
						setOpen((v) => !v);
					}
				}}
				className='cursor-pointer'
			>
				{children}
			</span>

			{open &&
				createPortal(
					<div
						ref={popupRef}
						role='tooltip'
						style={{
							top: position.top,
							left: position.left,
							position: 'absolute',
							transform: 'translateX(-50%)',
						}}
						className='z-50 min-w-max rounded-md border border-white/10 bg-neutral-900 px-2 py-1 text-[10px] text-white/80 shadow-lg shadow-black/40'
					>
						{content}

						<span
							className={`absolute left-1/2 block h-2 w-2 -translate-x-1/2 rotate-45 border-white/10 bg-neutral-900 ${
								position.placement === 'bottom'
									? '-top-1 border-l border-t'
									: '-bottom-1 border-b border-r'
							}`}
							style={{
								left: position.arrowLeft,
							}}
						/>
					</div>,
					document.body,
				)}
		</span>
	);
}

export default Tooltip;
