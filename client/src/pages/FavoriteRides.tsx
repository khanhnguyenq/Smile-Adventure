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
    <li
      key={index}
      onClick={() => handleRideClick(i.parkId, i.attractionId)}
      className="text-black font-1">
      {i.parkName} - {i.rideName}
    </li>
  ));

  return (
    <div className="flex flex-col content-center flex-wrap bg-white h-screen pt-[67px]">
      <ul>{list}</ul>
    </div>
  );
}
