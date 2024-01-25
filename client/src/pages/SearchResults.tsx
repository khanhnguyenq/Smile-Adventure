import { useEffect, useState } from 'react';
import { useUser } from '../components/useUser';
import { ParkLocation } from '../components/ParksByDistance';
import { fetchParks } from '../data';

export function SearchResults() {
  const { searchedPark } = useUser();
  const [parkList, setParkList] = useState<ParkLocation[]>();

  useEffect(() => {
    async function getParkDetails() {
      try {
        const result = await fetchParks();
        setParkList(result);
      } catch (err) {
        console.log(err);
      }
    }
    getParkDetails();
  }, []);

  const filteredParks = parkList?.filter((item) =>
    item.parkName
      .toLocaleLowerCase()
      .includes('' + searchedPark?.toLocaleLowerCase())
  );

  const list = filteredParks?.map((i, index) => (
    <li key={index}>{i.parkName}</li>
  ));

  return (
    <ul>
      {list?.length === 0 ? (
        <div>
          <p>Oops! Adventures Await, but the Theme Park Couldn't Be Found.</p>
          <p>Please double-check the name and try again.</p>
        </div>
      ) : (
        list
      )}
    </ul>
  );
}
