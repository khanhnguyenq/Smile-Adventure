import { FormEvent, useState } from 'react';
import { GetUserLocation, Location } from '../components/GetUserLocation';
import { ParksByDistance } from '../components/ParksByDistance';
import { useUser } from '../components/useUser';
import { useNavigate } from 'react-router-dom';

type LoggedInProps = {
  onSearch: (searchPark) => void;
};

export function LoggedIn({ onSearch }: LoggedInProps) {
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
    onSearch(searchInput);
    navigate('/search');
  }

  return (
    <div className="h-[850px] bg-secondary flex flex-col flex-wrap content-center">
      <p className="text-black text-center font-2">
        Welcome back, {displayName}!
      </p>
      <p className="text-black text-center font-1">
        Where are we heading today?
      </p>
      <div className="flex justify-center py-5">
        <form onSubmit={handleSearch}>
          <label className="block text-black text-center font-1">
            Search for a park below:
            <input
              type="text"
              placeholder="Type a Park Here"
              name="search-input"
              className="input input-bordered w-48 h-8 max-w-xs bg-gray-200 block"
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
      <p className="text-black text-center font-1">
        Or find a park based on your location!
      </p>
      <div>
        {location && (
          <ParksByDistance lat={location?.lat} long={location?.long} />
        )}
      </div>
    </div>
  );
}
