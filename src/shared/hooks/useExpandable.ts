import { useState } from 'react';

export function useExpandable(totalCount: number, previewCount: number) {
	const [expanded, setExpanded] = useState(false);

	return {
		expanded,
		toggle: () => setExpanded((p) => !p),
		hasMore: totalCount > previewCount,
		hiddenCount: totalCount - previewCount,
		previewCount,
	};
}
