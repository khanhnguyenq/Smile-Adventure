import { useContext } from 'react';
import { AppContext, AppContextValues } from './AppContext';

export function useUser(): AppContextValues {
  const contextValue = useContext(AppContext);
  if (!contextValue)
    throw new Error('useUser must be used within the component');
  return contextValue;
}
