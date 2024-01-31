import { useEffect, useState } from 'react';
import { ParkLocation } from '../components/ParksByDistance';
import { fetchParks } from '../data';
import { useNavigate, useSearchParams } from 'react-router-dom';

export function SearchResults() {
  const [parkList, setParkList] = useState<ParkLocation[]>();
  const [error, setError] = useState<unknown>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function getParkDetails() {
      try {
        const result = await fetchParks();
        setParkList(result);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }
    getParkDetails();
  }, []);

  function handleParkClick(parkId: string) {
    navigate(`/park/?id=${parkId}`);
  }

  const searchedPark = params.get('q');

  const filteredParks = parkList?.filter((item) =>
    item.parkName
      .toLocaleLowerCase()
      .includes('' + searchedPark?.toLocaleLowerCase())
  );

  const list = filteredParks?.map((i, index) => (
    <button
      onClick={() => handleParkClick(i.parkId)}
      className="btn btn-ghost btn-md text-xl"
      key={index}>
      {i.parkName}
    </button>
  ));

  if (error)
    return (
      <div>
        Error: {error instanceof Error ? error.message : 'Unknown Error'}
      </div>
    );

  if (isLoading)
    return (
      <div className="bg-white h-screen">
        <h1 className="text-black font-2 text-3xl py-5 text-center underline">
          Search Result:
        </h1>
        <p className="flex justify-center flex-col py-5 font-1 text-black text-center text-xl">
          Loading Information!
        </p>
      </div>
    );

  return (
    <div className="bg-white h-screen">
      <h1 className="text-black font-2 text-3xl py-5 text-center underline">
        Search Result:
      </h1>
      <ul>
        {list?.length === 0 ? (
          <div className="flex justify-center flex-col py-5 font-1 text-black text-center text-xl">
            <p>
              Oops! Adventures Await, but the "{searchedPark}" Couldn't Be
              Found.
            </p>
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
