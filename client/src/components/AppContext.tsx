import { createContext } from 'react';
import { User } from '../lib/api';

export type AppContextValues = {
  user: User | undefined;
  token: string | undefined;
  searchedPark: string | undefined;
};

export const AppContext = createContext<AppContextValues>({
  user: undefined,
  token: undefined,
  searchedPark: undefined,
});

export const UserProvider = AppContext.Provider;
