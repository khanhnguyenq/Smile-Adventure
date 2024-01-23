import { useState } from 'react';

type Location = {
  lat: number;
  long: number;
};

export function GetLocation() {
  const [location, setLocation] = useState<Location | null>(null);

  function handleLocationClick() {
    if (!navigator.geolocation) throw new Error('Geolocation is not supported');
    navigator.geolocation.getCurrentPosition(success, error);
  }

  function success(position) {
    const lat = position.coords.latitude;
    const long = position.coords.longitude;
    const data = localStorage.getItem('user');
    const newData = [data, lat, long];
    localStorage.setItem('user', JSON.stringify(newData));
    setLocation({ lat, long });
  }

  function error() {
    throw new Error('Unable to obtain location');
  }

  return (
    <div>
      <button className="btn btn-md text-white" onClick={handleLocationClick}>
        Get My Current Location
      </button>
      {location && <div>Got your location!</div>}
    </div>
  );
}
