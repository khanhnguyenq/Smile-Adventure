import { useContext } from 'react';
import { AppContext } from './AppContext';

export function useUser() {
  const user = useContext(AppContext);
  if (user === undefined)
    throw new Error('useUser must be used within the component');
  return user;
}
