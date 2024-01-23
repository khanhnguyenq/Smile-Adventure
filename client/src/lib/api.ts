export type User = {
  userId: number;
  username: string;
};

export type Auth = {
  token: string;
  user: User;
};

export type AppContextValues = {
  user: User | undefined;
};
