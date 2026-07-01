import SummaryCardsShell from '@/features/summary/components/layouts/SummaryCardsShell';
import type { TabType } from '@/features/summary/types/tab';
import { useLocalStorage } from '@/shared/hooks/useLocalStorage';

function SummaryError() {
	const [activeTab] = useLocalStorage<TabType>('summary-active-tab', 'overview');

	return (
		<div className='space-y-4'>
			<div className='text-red-400 text-sm'>Failed to load summary</div>

			<SummaryCardsShell activeTab={activeTab} handleTabChange={() => {}}>
				<div className='grid grid-cols-2 gap-4 md:grid-cols-3 opacity-40'>
					{Array.from({ length: 6 }).map((_, i) => (
						<div
							key={i}
							className='rounded-xl border border-white/10 bg-linear-to-br from-white/5 to-white/0 p-4'
						>
							<p className='text-white/20'>—</p>
						</div>
					))}
				</div>
			</SummaryCardsShell>
		</div>
	);
}

export default SummaryError;
