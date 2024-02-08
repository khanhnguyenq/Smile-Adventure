export type User = {
  userId: number;
  username: string;
  name: string;
};

export type Auth = {
  token: string;
  user: User;
};

export type AppContextValues = {
  user: User | undefined;
};

// type APIResult = {
//   destinations: {
//     id: string;
//     name: string;
//     parks: Park[];
//   }[];
// };

// type Park = {
//   id: string;
//   name: string;
// };

// function extractParks(apiResult: APIResult): Park[] {
//   const destinations = apiResult.destinations;
//   const result: Park[] = [];
//   for (let i = 0; i < destinations.length; i++) {
//     for (let j = 0; j < destinations[i].parks.length; j++) {
//       result.push(destinations[i].parks[j]);
//     }
//   }
//   return result;
// }
