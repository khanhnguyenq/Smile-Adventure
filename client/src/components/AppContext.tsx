import { createContext } from 'react';

export type User = {
  userId: number;
  username: string;
};

export type AppContextValues = {
  user: User | undefined;
};

export const AppContext = createContext({ user: undefined });
