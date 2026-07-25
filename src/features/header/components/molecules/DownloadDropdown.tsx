import { DOWNLOADS } from '@/features/header/constants/download-dropdown';
import { downloadFile } from '@/features/header/utils/download-dropdown';
import Dropdown from '@/shared/components/atoms/Dropdown';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';

function DownloadDropdown() {
	return (
		<Dropdown
			trigger={
				<>
					<ArrowDownTrayIcon className='h-3 w-3' />
					<span className='hidden sm:inline'>export</span>
				</>
			}
			items={DOWNLOADS.map(({ file, label }) => ({
				key: file,
				label,
				icon: <ArrowDownTrayIcon className='h-3 w-3 shrink-0' />,
				onClick: () => downloadFile(file),
			}))}
			width='w-36'
		/>
	);
}

export default DownloadDropdown;
