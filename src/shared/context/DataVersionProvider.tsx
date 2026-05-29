import { DataVersionContext } from '@/shared/context/DataVersionContext';
import { useDataVersion } from '@/shared/hooks/useDataVersion';
import { type ReactNode } from 'react';

export function DataVersionProvider({ children }: { children: ReactNode }) {
	const version = useDataVersion();
	return <DataVersionContext.Provider value={version}>{children}</DataVersionContext.Provider>;
}
