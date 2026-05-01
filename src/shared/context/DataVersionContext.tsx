import { useDataVersion } from '@/shared/hooks/useDataVersion';
import { createContext, useContext, type ReactNode } from 'react';

const DataVersionContext = createContext<string | null>(null);

export function DataVersionProvider({ children }: { children: ReactNode }) {
	const version = useDataVersion();
	return <DataVersionContext.Provider value={version}>{children}</DataVersionContext.Provider>;
}

export const useVersion = () => useContext(DataVersionContext);
