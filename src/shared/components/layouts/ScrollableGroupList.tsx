import { useEffect, useRef, useState } from 'react';

interface IScrollableGroupList<T extends { symbol: string }> {
	groups: T[];
	renderGroup: (group: T) => React.ReactNode;
}

// TODO automatically hide shadow on bottom when user reaches bottom
function ScrollableGroupList<T extends { symbol: string }>({
	groups,
	renderGroup,
}: IScrollableGroupList<T>) {
	const scrollRef = useRef<HTMLDivElement>(null);
	const [canScroll, setCanScroll] = useState(false);

	useEffect(() => {
		const el = scrollRef.current;
		if (!el) return;

		const check = () => setCanScroll(el.scrollHeight > el.clientHeight);
		check();

		const ro = new ResizeObserver(check);
		ro.observe(el);
		return () => ro.disconnect();
	}, [groups]);

	return (
		<div
			ref={scrollRef}
			className='max-h-64 overflow-y-auto pr-3 -mr-3 [scrollbar-width:thin]'
			style={
				canScroll
					? {
							maskImage: 'linear-gradient(to bottom, black calc(100% - 40px), transparent 100%)',
							WebkitMaskImage:
								'linear-gradient(to bottom, black calc(100% - 40px), transparent 100%)',
						}
					: undefined
			}
		>
			{groups.map((group, index) => (
				<div key={group.symbol}>
					{renderGroup(group)}
					{index < groups.length - 1 && (
						<div className='bg-linear-to-r from-transparent via-white/20 to-transparent h-px my-3' />
					)}
				</div>
			))}
		</div>
	);
}

export default ScrollableGroupList;
