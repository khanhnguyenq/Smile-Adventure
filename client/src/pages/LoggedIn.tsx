import { FormEvent, useState } from 'react';
import { GetUserLocation, Location } from '../components/GetUserLocation';
import { ParksByDistance } from '../components/ParksByDistance';
import { useUser } from '../components/useUser';
import { useNavigate } from 'react-router-dom';

export function LoggedIn() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [location, setLocation] = useState<Location>();

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
    <div className="h-screen bg-secondary flex flex-col content-center pt-[67px]">
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
            <button type="submit" className="btn btn-xs bg-primary text-white">
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
      <div className="h-screen bg-secondary">
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
