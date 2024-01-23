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

type Location = {
  longitude: number;
  latitude: number;
};

export function FetchLocation() {
  const [location, setLocation] = useState<Location[]>();

  useEffect(() => {
    async function getLocation() {
      try {
        const res = await fetch('https://api.themeparks.wiki/v1/destinations');
        if (!res.ok) throw new Error('Unable to fetch parks');
        const result = (await res.json()) as APIResult;
        const parkArray = extractParks(result);
        const locationArray = [];
        for (let i = 0; i < parkArray.length; i++) {
          const response = await fetch(
            `https://api.themeparks.wiki/v1/entity/${parkArray[i].id}`
          );
          const answer = await response.json();
          locationArray.push(answer.location);
        }
        setLocation(locationArray);
      } catch (err) {
        console.log(err);
      }
    }
    getLocation();
  }, []);
  if (!location) return <div>Loading....</div>;

  const resultList = location?.map((park) => (
    <li key={park?.longitude}>
      <div>
        '{park?.longitude}','{park?.latitude}'
      </div>
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
