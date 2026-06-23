import DetailPanel from '@/features/equity/components/atoms/DetailPanel';
import MonthCell from '@/features/equity/components/atoms/MonthCell';
import { MONTHS } from '@/features/equity/constants/heatmap';
import type { MonthlyReturn } from '@/features/equity/types/heatmap';
import { calcMonthlyReturns } from '@/features/equity/utils/performance';
import Card from '@/shared/components/atoms/Card';
import type { Deposit } from '@/shared/types/deposits';
import type { EquityPoint } from '@/shared/types/equity';
import { useLayoutEffect, useRef, useState } from 'react';

interface IMonthlyHeatmap {
	data: EquityPoint[];
	deposits: Deposit[];
}

function MonthlyHeatmap({ data, deposits }: IMonthlyHeatmap) {
	const [displayed, setDisplayed] = useState<MonthlyReturn | null>(null);
	const [lastEntry, setLastEntry] = useState<MonthlyReturn | null>(null);
	const [contentHeight, setContentHeight] = useState(0);
	const contentRef = useRef<HTMLDivElement>(null);

	const monthly = calcMonthlyReturns(data, deposits);
	const years = [...new Set(monthly.map((m) => m.year))].sort((a, b) => b - a);

	const handleSelect = (entry: MonthlyReturn) => {
		const isSame = displayed?.year === entry.year && displayed?.month === entry.month;
		if (!isSame) setLastEntry(entry);
		setDisplayed(isSame ? null : entry);
	};

	useLayoutEffect(() => {
		if (contentRef.current) {
			setContentHeight(contentRef.current.scrollHeight);
		}
	}, [lastEntry]);

	return (
		<Card title='monthly heatmap'>
			<div className='mb-2 grid grid-cols-[2rem_repeat(12,1fr)] gap-1 text-[10px] text-white/30'>
				<div />
				{MONTHS.map((m) => (
					<div key={m} className='text-center'>
						<span className='hidden sm:inline'>{m.slice(0, 3)}</span>
						<span className='sm:hidden'>{m.slice(0, 1)}</span>
					</div>
				))}
			</div>

			<div className='space-y-1'>
				{years.map((year) => {
					const yearMonths = monthly.filter((m) => m.year === year);
					const fullYear: (MonthlyReturn | null)[] = Array.from(
						{ length: 12 },
						(_, i) => yearMonths.find((m) => m.month === i + 1) ?? null,
					);

					return (
						<div key={year} className='grid grid-cols-[2rem_repeat(12,1fr)] gap-1 items-center'>
							<div className='text-[10px] text-white/30'>{year}</div>
							{fullYear.map((entry, i) =>
								entry ? (
									<MonthCell
										key={`${entry.year}-${entry.month}`}
										entry={entry}
										selected={displayed?.year === entry.year && displayed?.month === entry.month}
										onClick={() => handleSelect(entry)}
									/>
								) : (
									<div
										key={i}
										className='h-5 w-full rounded-sm bg-linear-to-br from-white/5 to-white/0'
									/>
								),
							)}
						</div>
					);
				})}
			</div>

			<div
				className='overflow-hidden transition-all duration-300 ease-in-out'
				style={{
					maxHeight: displayed ? contentHeight : 0,
					marginTop: displayed ? '0.75rem' : '0',
					opacity: displayed ? 1 : 0,
				}}
			>
				<div ref={contentRef}>{lastEntry && <DetailPanel entry={lastEntry} />}</div>
			</div>
		</Card>
	);
}

export default MonthlyHeatmap;
