import { createContext, useContext } from 'react';

export const DataVersionContext = createContext<string | null>(null);

export const useDataVersionContext = () => useContext(DataVersionContext);
