import { useEffect, useState } from 'react';
import { fetchAllFavoriteRides } from '../data';
import { useNavigate } from 'react-router-dom';

export type FavoriteRideInfo = {
  entryId: number;
  userId: number;
  attractionId: string;
  parkId: string;
  rideName: string;
  parkName: string;
};

export function FavoriteRides() {
  const [favoriteRides, setFavoriteRides] = useState<FavoriteRideInfo[]>([]);
  const [error, setError] = useState<unknown>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function getFavoriteRidesInfo() {
      try {
        const result = await fetchAllFavoriteRides();
        setFavoriteRides(result);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }
    getFavoriteRidesInfo();
  }, []);

  function handleRideClick(parkId, rideId) {
    navigate(`/ride/${parkId}/${rideId}`);
  }

  if (error)
    return (
      <div>
        Error: {error instanceof Error ? error.message : 'Unknown Error'}
      </div>
    );

  if (isLoading) return <div>Loading!</div>;

  const list = favoriteRides.map((i, index) => (
    <button
      key={index}
      onClick={() => handleRideClick(i.parkId, i.attractionId)}
      className="text-center bg-secondary shadow-xl p-4 font-1 text-black border-black border-solid border-2 m-2 rounded w-2/3 flex flex-col lg:w-1/4 md:w-1/3">
      {i.parkName} - {i.rideName}
    </button>
  ));

  return (
    <div className="bg-white pt-[67px]">
      <h1 className="text-black font-2 text-3xl py-5 text-center underline">
        Saved Rides:
      </h1>
      <div className="flex flex-col content-center flex-wrap bg-white h-screen">
        {list}
      </div>
    </div>
  );
}
