import { FormEvent, useEffect, useState } from 'react';
import { GetUserLocation, Location } from '../components/GetUserLocation';
import { ParksByDistance } from '../components/ParksByDistance';
import { useUser } from '../components/useUser';
import { useNavigate } from 'react-router-dom';
import { fetchAllFavoriteRides } from '../data';
import { FavoriteRideInfo } from './FavoriteRides';

export function LoggedIn() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [location, setLocation] = useState<Location>();
  const [favoriteRides, setFavoriteRides] = useState<FavoriteRideInfo[]>([]);
  const [error, setError] = useState<unknown>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

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

  const savedRides: string[] = [];
  for (let i = 0; i < favoriteRides.length; i++) {
    savedRides.push(favoriteRides[i].attractionId);
  }

  localStorage.setItem('entryIdArray', JSON.stringify(savedRides));

  if (error)
    return (
      <div>
        Error: {error instanceof Error ? error.message : 'Unknown Error'}
      </div>
    );

  if (isLoading) return <div>Loading!</div>;

  if (!user) throw new Error('Not Logged In');
  const displayName = user.username.replace(
    `${user.username[0]}`,
    `${user.username[0].toUpperCase()}`
  );

  function handleObtainedLocation(location: Location) {
    setLocation(location);
  }

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const searchInput = formData.get('search-input');
    navigate(`/search/?q=${searchInput}`);
  }

  function handleParkClick(parkId: string) {
    navigate(`/park/?id=${parkId}`);
  }

  return (
    <div className="h-screen bg-secondary flex flex-col content-center">
      <p className="text-black font-2 text-2xl py-5 text-center underline">
        Welcome back, {displayName}!
      </p>
      <p className="text-black text-center font-1 text-xl">
        Where are we heading today?
      </p>
      <div className="flex justify-center pt-2">
        <form onSubmit={handleSearch}>
          <label className="block text-black text-center font-1 text-xl">
            Search for a park below:
            <input
              type="text"
              placeholder="Type a Park Here"
              name="search-input"
              className="input input-bordered w-48 h-8 max-w-xs bg-gray-200 block m-4"
            />
            <button type="submit" className="btn btn-xs text-white">
              Search
            </button>
          </label>
        </form>
      </div>
      <div className="flex justify-center py-5">
        <GetUserLocation onObtainedLocation={handleObtainedLocation} />
      </div>
      <p className="text-black text-center font-1 text-xl">
        Or find a park based on your location!
      </p>
      <div>
        {location && (
          <ParksByDistance
            lat={location?.lat}
            long={location?.long}
            onParkClick={handleParkClick}
          />
        )}
      </div>
    </div>
  );
}
