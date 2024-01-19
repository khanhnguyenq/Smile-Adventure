import { useEffect, useState } from 'react';

type APIResult = {
  destinations: {
    id: string;
    name: string;
    parks: Park[];
  }[];
};

type Park = {
  id: string;
  name: string;
};

export function FetchParks() {
  const [parks, setParks] = useState<Park[]>();

  useEffect(() => {
    async function getParks() {
      try {
        const res = await fetch('https://api.themeparks.wiki/v1/destinations');
        if (!res.ok) throw new Error('Unable to fetch parks');
        const result = (await res.json()) as APIResult;
        setParks(extractParks(result));
      } catch (err) {
        console.log(err);
      }
    }
    getParks();
  }, []);

  if (!parks) return <div>Loading....</div>;

  const resultList = parks.map((park) => (
    <li key={park.id}>
      <div>Name: {park.name}</div>
      <div>Park ID: {park.id}</div>
    </li>
  ));

  return <ul>{resultList}</ul>;
}

function extractParks(apiResult: APIResult): Park[] {
  const destinations = apiResult.destinations;
  const result: Park[] = [];
  for (let i = 0; i < destinations.length; i++) {
    for (let j = 0; j < destinations[i].parks.length; j++) {
      result.push(destinations[i].parks[j]);
    }
  }
  return result;
}
