import { createContext } from 'react';
import { User } from '../lib/api';

export type AppContextValues = {
  user: User | undefined;
  token: string | undefined;
  clickedParkId: string | undefined;
  clickedParkName: string | undefined;
};

export const AppContext = createContext<AppContextValues>({
  user: undefined,
  token: undefined,
  clickedParkId: undefined,
  clickedParkName: undefined,
});

export const UserProvider = AppContext.Provider;
