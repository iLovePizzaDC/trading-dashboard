import DetailPanel from '@/features/equity/components/atoms/DetailPanel';
import MonthCell from '@/features/equity/components/atoms/MonthCell';
import { MONTHS } from '@/features/equity/constants/heatmap';
import type { MonthlyReturn } from '@/features/equity/types/heatmap';
import { calcMonthlyReturns } from '@/features/equity/utils/performance';
import Card from '@/shared/components/atoms/Card';
import type { EquityPoint } from '@/shared/types/equity';
import { useEffect, useRef, useState } from 'react';

interface IMonthlyHeatmap {
	data: EquityPoint[];
}

function MonthlyHeatmap({ data }: IMonthlyHeatmap) {
	const [selected, setSelected] = useState<MonthlyReturn | null>(null);
	const [displayed, setDisplayed] = useState<MonthlyReturn | null>(null);
	const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		if (closeTimer.current) clearTimeout(closeTimer.current);

		if (selected) {
			setDisplayed(selected);
		} else {
			closeTimer.current = setTimeout(() => setDisplayed(null), 300);
		}

		return () => {
			if (closeTimer.current) clearTimeout(closeTimer.current);
		};
	}, [selected]);

	const monthly = calcMonthlyReturns(data);
	const years = [...new Set(monthly.map((m) => m.year))].sort((a, b) => b - a);

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
										selected={selected?.year === entry.year && selected?.month === entry.month}
										onClick={() =>
											setSelected((prev) =>
												prev?.year === entry.year && prev?.month === entry.month ? null : entry,
											)
										}
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
				className={`grid transition-all duration-300 ease-in-out ${
					selected ? 'grid-rows-[1fr] mt-3' : 'grid-rows-[0fr]'
				}`}
			>
				<div className='overflow-hidden'>{displayed && <DetailPanel entry={displayed} />}</div>
			</div>
		</Card>
	);
}

export default MonthlyHeatmap;
