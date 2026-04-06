import { DOWNLOADS } from '@/features/header/constants/download-dropdown';
import { downloadFile } from '@/features/header/utils/download-dropdown';
import { ArrowDownTrayIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { useEffect, useRef, useState } from 'react';

function DownloadDropdown() {
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		function handleClick(e: MouseEvent) {
			if (ref.current && !ref.current.contains(e.target as Node)) {
				setOpen(false);
			}
		}
		document.addEventListener('mousedown', handleClick);
		return () => document.removeEventListener('mousedown', handleClick);
	}, []);

	return (
		<div className='relative' ref={ref}>
			<button
				onClick={() => setOpen((v) => !v)}
				className='flex items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-1.5 text-[10px] text-white/30 transition-colors hover:border-white/20 hover:text-white/50 cursor-pointer'
			>
				<ArrowDownTrayIcon className='h-3 w-3' />
				<span className='hidden sm:inline'>export</span>
				<ChevronDownIcon
					className='h-3 w-3 transition-transform duration-200'
					style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
				/>
			</button>

			{open && (
				<div className='absolute right-0 top-full z-50 mt-1.5 w-36 overflow-hidden rounded-xl border border-white/10 bg-[#1f2028] shadow-xl'>
					{DOWNLOADS.map(({ file, label }) => (
						<button
							key={file}
							onClick={() => {
								downloadFile(file);
								setOpen(false);
							}}
							className='flex w-full items-center gap-2.5 px-3 py-2 text-xs text-white/40 transition-colors hover:bg-white/5 hover:text-white/70 cursor-pointer'
						>
							<ArrowDownTrayIcon className='h-3 w-3 shrink-0' />
							{label}
						</button>
					))}
				</div>
			)}
		</div>
	);
}

export default DownloadDropdown;
