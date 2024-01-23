import { useContext } from 'react';
import { AppContext } from './AppContext';
import { User } from '../lib/api';

export function useUser(): User {
  const contextValue = useContext(AppContext);
  if (!contextValue)
    throw new Error('useUser must be used within the component');
  if (!contextValue.user) throw new Error('Not logged in!');
  return contextValue.user;
}
