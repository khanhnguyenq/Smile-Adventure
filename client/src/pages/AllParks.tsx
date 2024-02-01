import { useEffect, useState } from 'react';
import { ParkLocation } from '../components/ParksByDistance';
import { fetchParks } from '../data';
import { useNavigate } from 'react-router-dom';

export function AllParks() {
  const [parkList, setParkList] = useState<ParkLocation[]>();
  const [error, setError] = useState<unknown>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
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

  parkList?.sort(function (a, b) {
    if (a.parkName < b.parkName) {
      return -1;
    }
    if (a.parkName > b.parkName) {
      return 1;
    }
    return 0;
  });

  const list = parkList?.map((i, index) => (
    <button
      onClick={() => handleParkClick(i.parkId)}
      className="bg-secondary shadow-xl p-4 font-1 text-black border-black border-solid border-2 m-2 rounded w-2/3 flex flex-col lg:w-1/4 md:w-1/3"
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

  if (isLoading) return <div>Loading!</div>;

  return (
    <div className="bg-white pt-[67px]">
      <h1 className="text-black font-2 text-3xl py-5 text-center underline">
        All Parks:
      </h1>
      <div className="flex flex-wrap justify-center pt-6">{list}</div>
    </div>
  );
}
