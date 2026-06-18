import SummaryCardsShell from '@/features/summary/components/molecules/SummaryCardsShell'; // TODO [architecture] molecule in molecule
import type { TabType } from '@/features/summary/types/tab';
import { useLocalStorage } from '@/shared/hooks/useLocalStorage';

function SkeletonBox({ className }: { className?: string }) {
	return (
		<div
			className={`
				relative overflow-hidden rounded-md
				bg-white/10
				${className}
			`}
		>
			<div className='absolute inset-0 animate-[shimmer_1.5s_infinite] bg-linear-to-r from-transparent via-white/20 to-transparent' />
		</div>
	);
}

function SummarySkeleton() {
	const [activeTab] = useLocalStorage<TabType>('summary-active-tab', 'overview');

	return (
		<div className='space-y-4'>
			<div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
				<div className='md:col-span-2 rounded-xl border border-white/10 bg-linear-to-br from-white/5 to-white/0 p-4'>
					<SkeletonBox className='mb-2 h-2 w-24' />
					<SkeletonBox className='mb-3 h-9 w-48' />
					<SkeletonBox className='h-2 w-32' />
				</div>

				<div className='rounded-xl border border-white/10 bg-linear-to-br from-white/5 to-white/0 p-4'>
					<SkeletonBox className='mb-2 h-2 w-16' />
					<SkeletonBox className='mb-3 h-5 w-20' />
					<SkeletonBox className='h-2 w-24' />
				</div>
			</div>

			<SummaryCardsShell activeTab={activeTab} handleTabChange={() => {}}>
				<div className='overflow-hidden' style={{ height: 240 }}>
					<div className='grid grid-cols-2 gap-4 md:grid-cols-3'>
						{Array.from({ length: 6 }).map((_, i) => (
							<div
								key={i}
								className='rounded-xl border border-white/10 bg-linear-to-br from-white/5 to-white/0 p-4'
							>
								<div className='flex flex-col items-center'>
									<SkeletonBox className='mb-2 h-2 w-16' />
									<SkeletonBox className='mb-3 h-7 w-28' />
									<SkeletonBox className='h-2 w-20' />
								</div>
							</div>
						))}
					</div>
				</div>
			</SummaryCardsShell>
		</div>
	);
}

export default SummarySkeleton;
