export type User = {
  userId: number;
  username: string;
};

export type AppContextValues = {
  user: User | undefined;
};
