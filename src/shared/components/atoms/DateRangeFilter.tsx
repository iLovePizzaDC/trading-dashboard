import { RANGES, type Range } from '@/shared/constants/date-range';

interface IDateRangeFilter {
	range: Range;
	setRange: React.Dispatch<React.SetStateAction<Range>>;
}

function DateRangeFilter({ range, setRange }: IDateRangeFilter) {
	return (
		<div className='flex gap-1 overflow-x-auto scrollbar-none'>
			{RANGES.map((r) => (
				<button
					key={r}
					onClick={() => setRange(r)}
					className={`shrink-0 rounded px-2 py-0.5 text-xs font-medium transition cursor-pointer ${
						range === r ? 'bg-white/15 text-white' : 'text-white/35 hover:text-white/60'
					} transition-all duration-300 cursor-pointer`}
				>
					{r}
				</button>
			))}
		</div>
	);
}

export default DateRangeFilter;
