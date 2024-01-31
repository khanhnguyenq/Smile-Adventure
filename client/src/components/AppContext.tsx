import { createContext } from 'react';
import { Auth, User } from '../lib/api';
import { FavoriteRideInfo } from '../pages/FavoriteRides';

export type AppContextValues = {
  user: User | undefined;
  token: string | undefined;
  favoriteRides: FavoriteRideInfo[] | [];
  handleSignIn: (auth: Auth) => void;
  handleSignOut: () => void;
  removeAttraction: (deleteId: number) => void;
  addAttraction: (result: Partial<FavoriteRideInfo>) => void;
};

export const AppContext = createContext<AppContextValues>({
  user: undefined,
  token: undefined,
  favoriteRides: [],
  handleSignIn: () => undefined,
  handleSignOut: () => undefined,
  removeAttraction: () => undefined,
  addAttraction: () => undefined,
});

export const UserProvider = AppContext.Provider;
