import { useEffect, useState } from 'react';
import { useUser } from '../components/useUser';
import { ParkLocation } from '../components/ParksByDistance';
import { fetchParks } from '../data';

type SearchResultsProps = {
  onParkClick: (parkId: string, parkName: string) => void;
};

export function SearchResults({ onParkClick }: SearchResultsProps) {
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
    <button
      onClick={() => onParkClick(i.parkId, i.parkName)}
      className="btn btn-ghost btn-md text-xl"
      key={index}>
      {i.parkName}
    </button>
  ));

  return (
    <div className="bg-white h-screen">
      <h1 className="text-black font-2 text-3xl py-5 text-center underline">
        Search Result:
      </h1>
      <ul>
        {list?.length === 0 ? (
          <div className="flex justify-center flex-col py-5 font-1 text-black text-center text-xl">
            <p>Oops! Adventures Await, but the Theme Park Couldn't Be Found.</p>
            <p className="pt-8">Please double-check the name and try again.</p>
          </div>
        ) : (
          <div className="flex justify-center flex-col py-5 font-1 text-black">
            {list}
          </div>
        )}
      </ul>
    </div>
  );
}
