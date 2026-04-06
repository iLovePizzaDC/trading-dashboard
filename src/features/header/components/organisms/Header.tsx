import DownloadDropdown from '@/features/header/components/molecules/DownloadDropdown';

function Header() {
	return (
		<div className='flex items-center justify-between'>
			<p className='text-lg uppercase tracking-widest text-white/30'>luna — trading bot</p>
			<DownloadDropdown />
		</div>
	);
}

export default Header;
