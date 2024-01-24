import { useState } from 'react';
import { GetUserLocation, Location } from '../components/GetUserLocation';
import { ParksByDistance } from '../components/ParksByDistance';
import { useUser } from '../components/useUser';

export function LoggedIn() {
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

  return (
    <div className="h-[850px] bg-secondary flex flex-col flex-wrap content-center">
      <p className="text-black text-center font-2">
        Welcome back, {displayName}!
      </p>
      <p className="text-black text-center font-1">
        Where are we heading today?
      </p>
      <div className="flex justify-center py-5">
        <label className="block text-black text-center font-1">
          Search for a park below:
          <input
            type="text"
            placeholder="Type a Park Here"
            name="username"
            className="input input-bordered w-48 h-8 max-w-xs bg-gray-200 block"
          />
        </label>
      </div>
      <div className="flex justify-center py-5">
        <GetUserLocation onObtainedLocation={handleObtainedLocation} />
      </div>
      <p className="text-black text-center font-1">
        Or Select One of these Parks:
      </p>
      <div>
        <ParksByDistance lat={location?.lat} long={location?.long} />
      </div>
    </div>
  );
}
