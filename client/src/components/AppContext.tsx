import { createContext } from 'react';
import { User } from '../lib/api';

export const AppContext = createContext<User | undefined>(undefined);

export const UserProvider = AppContext.Provider;
