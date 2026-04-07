import DownloadDropdown from '@/features/header/components/molecules/DownloadDropdown';

function Header() {
	return (
		<div className='flex items-center justify-between'>
			<div className='flex items-center gap-3'>
				<p className='text-lg uppercase tracking-widest text-white/30'>luna — trading bot</p>
				<div className='flex items-center gap-1.5'>
					<span className='w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse' />
					<span className='text-xs text-white/30'>live</span>
				</div>
			</div>
			<DownloadDropdown />
		</div>
	);
}

export default Header;
