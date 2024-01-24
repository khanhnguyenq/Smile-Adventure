import { useEffect, useState } from 'react';
import { useUser } from '../components/useUser';

type ParkId = {
  parkName: string;
  parkId: string;
};

export function SearchResults() {
  const { searchedPark } = useUser();
  const [parkList, setParkList] = useState<ParkId[]>();

  useEffect(() => {
    async function getParkDetails() {
      try {
        const res = await fetch('/api/parks');
        if (!res.ok) throw new Error(`${res.status}: Unable to get parks`);
        const result = (await res.json()) as ParkId[];
        setParkList(result);
      } catch (err) {
        console.log(err);
      }
    }
    getParkDetails();
  }, []);

  if (!searchedPark)
    return (
      <div>
        <p>Oops! Adventures Await, but the Theme Park Couldn't Be Found.</p>
        <p>Please double-check the name and try again.</p>
      </div>
    );

  const filteredParks = parkList?.filter((item) =>
    item.parkName
      .toLocaleLowerCase()
      .includes(searchedPark?.toLocaleLowerCase())
  );

  const list = filteredParks?.map((i, index) => (
    <li key={index}>{i.parkName}</li>
  ));
  if (!list)
    return (
      <div>
        <p>Oops! Adventures Await, but the Theme Park Couldn't Be Found.</p>
        <p>Please double-check the name and try again.</p>
      </div>
    );

  return <ul>{list}</ul>;
}
